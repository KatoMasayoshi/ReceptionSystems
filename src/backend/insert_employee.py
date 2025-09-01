import mysql.connector

# DB接続設定
# config = {
#     'user': 'apiuser',
#     'password': 'A-proud200709',  # ← ご自身の環境に合わせて変更
#     'host': 'localhost',
#     'database': 'reception_system',
#     'port': 3306
# }


# DB設定
# ローカルテスト
config = {
    'user': 'AdminUser',
    'password': 'V7fnCxi3',
    'host': 'localhost',
    'database': 'reception_system',
    'port': 3306
}


# 登録するデータ
new_employee = {
    'name': '佐藤一郎',
    'department': '営業部'
}

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    insert_query = """
        INSERT INTO employees (name, department)
        VALUES (%s, %s)
    """
    cursor.execute(insert_query, (new_employee['name'], new_employee['department']))
    conn.commit()

    print("✅ 社員データを追加しました")

except mysql.connector.Error as err:
    print(f"❌ エラー: {err}")
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
