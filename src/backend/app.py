from fastapi import FastAPI, HTTPException, Body, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import mysql.connector
from account_api import router as acounnt_router
from notify_api import router as notify_router
import re
import os

app = FastAPI()

app.include_router(notify_router)

# ======= CORS設定 =======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では制限を推奨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======= MySQL接続情報 =======
# config = {
#     'user': 'apiuser',
#     'password': 'A-proud200709',
#     'host': 'localhost',
#     'database': 'reception_system',
#     'port': 3306
# }

# ローカルテスト
# DB設定
config = {
    'user': 'AdminUser',
    'password': 'V7fnCxi3',
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

router = APIRouter()

# DB設定
# config = {
#     'user': 'apiuser',
#     'password': 'A-proud200709',
#     'host': 'localhost',
#     'database': 'reception_system',
#     'port': 3306
# }

# # DB設定
# ローカルテスト
config = {
    'user': 'AdminUser',
    'password': 'V7fnCxi3',
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

@app.post("/login")
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


# ======= 来訪者登録 =======
@app.post("/visitors")
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

@app.get("/visitors-logs")
def get_visitors():
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

@app.put("/visitor-logs/{visitor_id}")
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
@app.get("/employees")
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

@app.post("/employees")
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
@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, employee: Employee):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        query = "UPDATE employees SET name = %s, department = %s, image_path = %s WHERE id = %s"
        cursor.execute(query, (employee.name, employee.department, employee.image_path, employee_id))
        conn.commit()

        return {"message": "Employee updated"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()



@app.delete("/employees/{employee_id}")
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
app.include_router(acounnt_router)
