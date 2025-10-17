

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("GEMINI2_API_KEY")

# Configure the Gemini client
genai.configure(api_key=api_key)

# Create a chat instance using the Gemini model
chat = genai.GenerativeModel('gemini-2.5-flash').start_chat()

print("🤖 Gemini Chatbot is ready! Type 'exit' to quit.\n")

while True:
    user_input = input("You: ").strip()

    if not user_input:
        print("⚠️ Please type something before sending.")
        continue

    if user_input.lower() in ['exit', 'quit']:
        print("👋 Goodbye!")
        break

    try:
        response = chat.send_message(user_input)
        print("Gemini:", response.text)
    except Exception as e:
        print("❌ Error:", e)

