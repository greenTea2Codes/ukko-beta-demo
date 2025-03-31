from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from llm import get_llm_response
from weather import get_weather

app = FastAPI()

class UserInput(BaseModel):
    message: str
    location: str


@app.get("/")
async def read_root():
    return {"response": "Hello World"}


@app.post("/chat")
async def create_weather_advice(user_input: UserInput):
    weather_data = get_weather(user_input.location)
    return get_llm_response(user_input.message, user_input.location, weather_data)
    # return {"response": llm_response}