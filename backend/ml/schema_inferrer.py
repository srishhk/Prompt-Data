from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are a data schema expert. Given a user description of a dataset,
return ONLY a valid JSON schema. No explanation, no markdown, just JSON.

Format:
{
  "dataset_name": "descriptive name",
  "columns": [
    {
      "name": "column_name",
      "type": "int|float|categorical|name|email|phone|date|bool",
      "distribution": "normal|uniform|skewed",
      "mean": 45,
      "std": 10,
      "min": 0,
      "max": 100,
      "values": ["option1", "option2"],
      "weights": [0.6, 0.4]
    }
  ]
}

Rules:
- Use Indian names, cities, phone numbers where relevant
- Make values statistically realistic
- For categorical columns always include values and weights
- For numeric columns always include mean, std, min, max
"""

def infer_schema(prompt: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    raw = response.choices[0].message.content
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)