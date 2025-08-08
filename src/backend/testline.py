from fastapi import FastAPI
import requests

app = FastAPI()

# LINEチャネルアクセストークン
LINE_ACCESS_TOKEN = "1XHXcpj+pwyvwWeOAK9BVAj4phJ9ePn7RJ4fZLlso6VFGPIfqmtcJxLA9dtEan65cShksVRUmujKbcXt3d+dXwFCYk9G/RE4nMpwl27KW6N/owi1na4ehWo2pxmgZj/xyzIyWjrdxLQ+uoY7JY4cJgdB04t89/1O/w1cDnyilFU="
# USER_ID = "U0095e4129f2d859fbe0e2e90e213e4ee"
GROUP_ID = "C2ebf1193fb6114fdae1bb66f0ba192fc"

@app.post("/send-message")
def send_message():
    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "to": GROUP_ID,
        "messages":[
            {
                "type": "text",
                "text": "おはよう！！！これはテストだよ！！"
            }
        ]
    }

    res = requests.post("https://api.line.me/v2/bot/message/push",
                        headers=headers,
                        json=body)
    
    return {
        "status_code": res.status_code,
        "response": res.json()
    }