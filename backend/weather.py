from dotenv import load_dotenv
import os
import requests
import xml.etree.ElementTree as ET
import datetime
from collections import defaultdict
import math
from fastapi import HTTPException

load_dotenv()

base_url = os.getenv("FMI_BASE_URL")
q_service = os.getenv("FMI_WFS_SERVICE")
q_service_version = os.getenv("FMI_WFS_SERVICE_VERSION")
q_request = os.getenv("FMI_WFS_REQUEST")
q_stored_query_id = os.getenv("ECMWF_FORCAST_SURFACE_POINT_SIMPLE")
q_weather_params = os.getenv("FMI_PARAMETERS")

start_time = datetime.datetime.now(datetime.timezone.utc)
start_time_str = datetime.datetime.strftime(start_time, "%Y-%m-%dT%H:%M:%SZ")
hours = 1
tstep = 10
end_time = start_time + datetime.timedelta(hours=hours)
end_time_str = datetime.datetime.strftime(end_time, "%Y-%m-%dT%H:%M:%SZ")

def get_weather(location):
    weather_forcasts = {"place": location, "forcasts": []}
    url = f"{base_url}?service={q_service}&version={q_service_version}&request={q_request}&storedquery_id={q_stored_query_id}&place={location}&starttime={start_time_str}&endtime={end_time_str}&timestep={tstep}&parameters={q_weather_params}"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Failed to fetch weather data: {response.text}"
        )

    tree = ET.fromstring(response.content)

    for elem in tree.iter():
        if elem.tag.endswith("BsWfsElement"):
            forcast = {"time": None, "name": None, "value": None}

            for child in elem:
                if child.tag.endswith("Time"):
                    forcast["time"] = child.text
                elif child.tag.endswith("ParameterName"):
                    forcast["name"] = child.text
                elif child.tag.endswith("ParameterValue"):
                    forcast["value"] = child.text
            weather_forcasts["forcasts"].append(forcast)
    
    # group by time
    grouped = defaultdict(dict)
    for item in weather_forcasts["forcasts"]:
        time = item["time"]
        name = item["name"]
        value = item["value"]

        try:
            value = float(value)
            if math.isnan(value):
                value = None
        except (ValueError, TypeError):
            value = None
        
        grouped[time]["time"] = time
        grouped[time][name] = value
    
    weather_forcasts["forcasts"] = list(grouped.values())

    return weather_forcasts

