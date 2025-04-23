from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector
import re

router = APIRouter()

# DB設定
config = {
    'user': 'root',
    'password': 'Gion182533Koryo1g2d3d',
    'host': 'localhost',
    'database': 'reception_system',
    'port': 3306
}

class LoginRequest(BaseModel):
    username: str
    password: str

def is_valid_password(password: str) -> bool:
    return (
        len(password) >= 8 and
        re.search(r'[A-Z]', password) and
        re.search(r'[a-z]', password) and
        re.search(r'[0-9]', password) and
        re.search(r'[^A-Za-z0-9]', password)
    )

@router.post("/api/login")
def login(data: LoginRequest):
    if not is_valid_password(data.password):
        raise HTTPException(status_code=400, detail="パスワードの要件を満たしていません")

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(query, (data.username, data.password))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="IDまたはパスワードが間違っています")

        if user['username'].startswith("admin"):
            return {"role": "admin", "message": "管理画面へ遷移"}
        else:
            return {"role": "user", "message": "受付画面へ遷移"}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
