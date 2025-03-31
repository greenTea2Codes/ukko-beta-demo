# from dotenv import load_dotenv
import os
import requests
import xml.etree.ElementTree as ET
import datetime
from collections import defaultdict
import math
from fastapi import HTTPException

# load_dotenv()

base_url = os.getenv("FMI_BASE_URL")
q_service = os.getenv("FMI_WFS_SERVICE")
q_service_version = os.getenv("FMI_WFS_SERVICE_VERSION")
q_request = os.getenv("FMI_WFS_REQUEST")
q_stored_query_id = os.getenv("ECMWF_FORECAST_SURFACE_POINT_SIMPLE")
q_weather_params = os.getenv("FMI_PARAMETERS")

    
def get_weather(location):
    start_time = datetime.datetime.now(datetime.timezone.utc)
    rounded_minute = (start_time.minute // 10) * 10
    round_start = start_time.replace(minute=rounded_minute, second=0, microsecond=0)

    start_time_str = round_start.strftime("%Y-%m-%dT%H:%M:%SZ")

    hours = 1
    tstep = 10
    end_time = round_start + datetime.timedelta(hours=hours)

    end_time_str = end_time.strftime("%Y-%m-%dT%H:%M:%SZ")

    weather_forecasts = {"place": location, "forecasts": []}
    
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
            forecast = {"time": None, "name": None, "value": None}

            for child in elem:
                if child.tag.endswith("Time"):
                    forecast["time"] = child.text
                elif child.tag.endswith("ParameterName"):
                    forecast["name"] = child.text
                elif child.tag.endswith("ParameterValue"):
                    forecast["value"] = child.text
            weather_forecasts["forecasts"].append(forecast)
    
    # group by time
    grouped = defaultdict(dict)
    for item in weather_forecasts["forecasts"]:
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
    
    weather_forecasts["forecasts"] = list(grouped.values())

    return weather_forecasts

