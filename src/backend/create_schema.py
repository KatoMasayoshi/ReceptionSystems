
import mysql.connector

# 接続情報を設定（必要に応じて編集）
# config = {
#     'user': 'apiuser',
#     'password': 'A-proud200709',
#     'host': 'localhost',
#     'port': 3306,
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

# DB作成・テーブル作成スクリプト
def create_database_and_tables():
    try:
        # DB接続（接続時はDB指定しない）
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # データベース作成
        cursor.execute("CREATE DATABASE IF NOT EXISTS visitor_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute("USE visitor_system;")

        # 社員テーブル作成
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            department VARCHAR(100) NOT NULL
        );
        """)

        # 来訪ログテーブル作成
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitor_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            check_in DATETIME NOT NULL,
            check_out DATETIME,
            company VARCHAR(100),
            name VARCHAR(100),
            purpose VARCHAR(100),
            companions VARCHAR(10),
            companion_names TEXT
        );
        """)

        print("✅ データベースとテーブルの作成が完了しました。")

        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"エラー: {err}")

if __name__ == '__main__':
    create_database_and_tables()
