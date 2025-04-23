from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector

router = APIRouter()

# DB設定
config = {
    'user': 'root',
    'password': 'Gion182533Koryo1g2d3d',
    'host': 'localhost',
    'database': 'reception_system',
    'port': 3306
}

class User(BaseModel):
    username: str
    password: str

@router.get("/api/users")
def get_users():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, password FROM users")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

@router.post("/api/users")
def add_user(user: User):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(query, (user.username, user.password))
        conn.commit()
        return {"message": "ユーザー作成成功"}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.put("/api/users/{user_id}")
def update_user(user_id: int, user: User):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "UPDATE users SET username = %s, password = %s WHERE id = %s"
        cursor.execute(query, (user.username, user.password, user_id))
        conn.commit()
        return {"message": "ユーザー更新成功"}
    finally:
        cursor.close()
        conn.close()

@router.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()
        return {"message": "ユーザー削除成功"}
    finally:
        cursor.close()
        conn.close()
