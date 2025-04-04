# from dotenv import load_dotenv
import os
from transformers import pipeline
import torch

# load_dotenv()
# Automatically choose device
device = 0 if torch.cuda.is_available() else -1

model = os.getenv("LLM_MODEL_CHECKPOINT")
pipe = pipeline("text-generation", model, device=device)

def get_llm_response(user_input, user_context, weather_data):
    # print(weather_data)
    # system_prompt = f"""
    # You are a helpful and friendly assistant. You give simple and direct clothing advice based on the user's location and current temperature. Avoid repeating the same information.
    # The user's location is: {user_context or 'Unknown'}
    # The current temperature there is: {weather_data['forecasts'][0]['temperature'] or 'Not available'} Degrees Celsius.
    # """

    # system_prompt = f"""
    # You are a helpful and friendly assistant. You give simple and direct clothing advice based on the user's location and current temperature. Avoid repeating the same information.
    # Examples:
    # User: It's 3°C here. Can I wear a t-shirt?
    # Assistant: No, it's too cold for a t-shirt. You should wear something warmer like a jacket.

    # User: It's 18°C. Should I wear a coat?
    # Assistant: No need for a coat. A hoodie or light jacket should be enough.

    # Now here's the current situation:    
    # The user's location is: {user_context or 'Unknown'}
    # The current temperature there is: {weather_data['forecasts'][0]['temperature'] or 'Not available'} Degrees Celsius.
    # """

    system_prompt = f"""
    You are Bob, a helpful assistant who gives simple and direct clothing advice.
    Only use the current weather to answer the user's question.
    Current temperature: {weather_data['forecasts'][0]['temperature'] or 'Not available'} Degrees Celsius.
    Location: {user_context or 'Unknown'}
    Avoid repeating yourself. Do not make up temperature values.
    """

    print(system_prompt)
    messages = [{'role': 'system', 'content': system_prompt}]
    messages.append({'role': 'user', 'content': user_input})
    result = pipe(messages, max_new_tokens=150)
    print(result[0]['generated_text'])
    llm_response = result[0]['generated_text'][-1]
    return {"response": llm_response}