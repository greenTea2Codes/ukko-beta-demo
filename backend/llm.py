def get_llm_response(user_input, user_context, weather_data):
    llm_response = {
        "message": user_input,
        "context": user_context,
        "weather": weather_data
    }
    return llm_response