import os
from transformers import pipeline
import torch

device = 0 if torch.cuda.is_available() else -1

check_point = os.getenv("LLM_MODEL_CHECKPOINT")

pipe = pipeline("text-generation", model=check_point, device=device)

def get_llm_response(user_input, user_context, weather_data):

    system_prompt = create_system_prompt(user_context, weather_data['forecasts'][0]['temperature'])

    messages = [{'role': 'system', 'content': system_prompt}]
    messages.append({'role': 'user', 'content': user_input})

    llm_config = get_llm_config()
    result = pipe(messages, **llm_config)

    llm_response = result[0]['generated_text'][-1]
    return {"response": llm_response}


def create_system_prompt(location, temperature):
    system_prompt = f"""
    You are Ukko, a helpful assistant who gives simple and direct clothing advice based on the temperature outside.

    Temperature: {temperature or 'Not available'}°C  
    Location: {location or 'Unknown'}

    Please answer the user's question in exactly one or two complete sentences.  
    Do not list multiple clothing items.  
    Do not write more than two sentences.  
    Do not repeat phrases.  
    Be clear, concise, and practical.
    """   
    return system_prompt.strip() 


def get_llm_config():
    return {
        "max_new_tokens": 150,
        "temperature": 0.2,
        "top_p": 0.85,
        "repetition_penalty": 1.15,
        "do_sample": True
    }