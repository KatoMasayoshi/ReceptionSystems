from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import mysql.connector
from login_check import router as login_router
from account_api import router as acounnt_router
import os

app = FastAPI()

# ======= CORS設定 =======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では制限を推奨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======= MySQL接続情報 =======
config = {
    'user': 'root',
    'password': 'Gion182533Koryo1g2d3d',
    'host': 'localhost',
    'database': 'reception_system',
    'port': 3306
}

# ======= モデル定義 =======
class Visitor(BaseModel):
    company: str
    name: str
    purpose: str
    persons: str = None

class Employee(BaseModel):
    name: str
    department: str
    image_path: str = None  # ✅ 新たに追加（例："/image/kato.jpg"）

# ======= 来訪者登録 =======
@app.post("/api/visitors")
def add_visitor(visitor: Visitor):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        check_in = datetime.now()
        check_out = check_in + timedelta(minutes=45)

        query = """
            INSERT INTO visitor_logs (check_in, check_out, company, name, purpose, companions)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            check_in.strftime("%Y-%m-%d %H:%M:%S"),
            check_out.strftime("%Y-%m-%d %H:%M:%S"),
            visitor.company,
            visitor.name,
            visitor.purpose,
            visitor.persons
        ))
        conn.commit()
        return {"message": "Visitor added"}
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# ======= 来訪ログ取得・更新 =======
@app.get("/api/visitor-logs")
def get_visitor_logs():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM visitor_logs")
        return cursor.fetchall()
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.put("/api/visitor-logs/{visitor_id}")
def update_visitor_log(visitor_id: int, log: dict):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = """
            UPDATE visitor_logs SET
            check_in = %s,
            check_out = %s,
            company = %s,
            name = %s,
            purpose = %s,
            companions = %s
            WHERE id = %s
        """
        cursor.execute(query, (
            log["check_in"],
            log.get("check_out"),
            log["company"],
            log["name"],
            log["purpose"],
            log["companions"],
            visitor_id
        ))
        conn.commit()
        return {"message": "Updated successfully"}
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# ======= 社員情報取得・追加・更新・削除 =======
@app.get("/api/employees")
def get_employees():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees")
        return cursor.fetchall()
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/api/employees")
def add_employee(employee: Employee):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "INSERT INTO employees (name, department, image_path) VALUES (%s, %s, %s)"
        cursor.execute(query, (employee.name, employee.department, employee.image_path))
        conn.commit()
        return {"message": "Employee added successfully", "id": cursor.lastrowid}
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# ==============================
# 社員画像パスだけを保存する（画像ファイルは保存しない）
# ==============================
@app.put("/api/employees/{employee_id}/select-image")
def set_employee_image_path(employee_id: int, data: dict = Body(...)):
    image_path = data.get("image_path")
    if not image_path:
        raise HTTPException(status_code=400, detail="image_path が必要です")

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute("UPDATE employees SET image_path = %s WHERE id = %s", (image_path, employee_id))
        conn.commit()
        return {"message": "画像パスをDBに保存しました", "image_path": image_path}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()



@app.delete("/api/employees/{employee_id}")
def delete_employee(employee_id: int):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM employees WHERE id = %s", (employee_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"message": "Deleted successfully"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# ======= 外部ルーター読み込み =======
app.include_router(login_router)
app.include_router(acounnt_router)
