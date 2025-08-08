# backend/notify_api.py
from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

LINE_ACCESS_TOKEN = "1XHXcpj+pwyvwWeOAK9BVAj4phJ9ePn7RJ4fZLlso6VFGPIfqmtcJxLA9dtEan65cShksVRUmujKbcXt3d+dXwFCYk9G/RE4nMpwl27KW6N/owi1na4ehWo2pxmgZj/xyzIyWjrdxLQ+uoY7JY4cJgdB04t89/1O/w1cDnyilFU="
# GROUPの内部ID
GROUP_ID = "C2ebf1193fb6114fdae1bb66f0ba192fc"
# デバッグ用(自分の内部ID)
# GROUP_ID = "U0095e4129f2d859fbe0e2e90e213e4ee"

class NotifyRequest(BaseModel):
    employee_name: str
    purpose: str
    company: str
    name: str
    companions: str

@router.post("/notify")
def notify_line(data:NotifyRequest):
    message = f"""
📢 来訪者のお知らせ

🧑 氏名：{data.name}
🏢 会社名：{data.company}
🎯 来訪目的：{data.purpose}
👥 同行人数：{data.companions}
🧑‍💼 担当者：{data.employee_name}
"""
    
    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "to": GROUP_ID,
        "messages": [
            {
                "type": "text",
                "text": message
            }
        ]
    }

    res = requests.post("https://api.line.me/v2/bot/message/push", headers=headers, json=body)
    

    return {
        "status_code": res.status_code,
        "response": res.json()
    }

@router.post("/notify/delivery")
def notify_delivery():
    message = "🚚 配送業者が来ました！対応お願いします！"

    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "to": GROUP_ID,
        "messages": [{"type": "text", "text": message}]
    }

    res = requests.post("https://api.line.me/v2/bot/message/push", headers=headers, json=body)
    return {"status": res.status_code, "response": res.json()}

@router.post("/notify/general")
def notify_general():
    message = "👥 【総合受付】お客様がいらっしゃいました。対応お願いします。"

    headers = {
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "to": GROUP_ID,
        "messages": [{"type":"text", "text": message}]
    }

    res = requests.post("https://api.line.me/v2/bot/message/push", headers=headers, json=body)
    return {"status": res.status_code, "response": res.json()}
