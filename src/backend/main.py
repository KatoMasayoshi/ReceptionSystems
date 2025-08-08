from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "本番環境 FastAPI 起動成功！"}

@app.get("/login")
def read_root():
    return{"message":"テスト"}
