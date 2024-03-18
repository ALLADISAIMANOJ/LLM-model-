from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from fastapi import File, UploadFile, HTTPException , Form 
from typing import List
import os
import shutil
import openai
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from docx import Document
import pandas as pd
import io
import PyPDF2
from pathlib import Path
from io import BytesIO
from dotenv import load_dotenv




# Load environment variables from .env file (if any)
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
class Response(BaseModel):
    result: str | None

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADED_DIR= Path() / 'uploads'

@app.get("/")
def read_root():
    return {"message": "Hello World"}

class FileUpload(BaseModel):
    file_name: str
    file_type: str
    file_size: int
messages = [
        {"role": "system", "content": "You are a professional Question and Answer AI Assistant helping with information in regards to a csv, pdf, and text input file."},
    ]


def chatbot(api_key, query_text, file_data, file_type):
    openai.api_key = api_key
    if query_text:
        messages.append({"role": "user", "content": query_text})
    if file_data:
        messages.append({"role": "user", "content": f"{file_data} File Type: {file_type}"})
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages, stream=True
    )
    
    #response_text = st.empty()
    response_line = ""
    for chunk in chat:
        chunk_message = chunk['choices'][0]['delta']
        if chunk_message.get('content'):
            response_line += chunk_message['content']
            #response_text.write("Response: " + response_line)
            messages.append({"role": "assistant", "content": response_line})
    return(response_line)

# Endpoint to handle file uploads
@app.post("/predict/")
async def upload_file(file: UploadFile = File(...), question: str = Form(...)):
    file_name, file_type = os.path.splitext(file.filename)
    allowed_extensions = ['.txt', '.docx', '.pdf', '.csv']  # Add more if needed

    if file_type not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not supported")
    
    # print(question) 
    # print(file_type)

    binary_data = await file.read()
    # save_to = UPLOADED_DIR/file.filename    
    # with open(save_to,'wb') as f:
    #     f.write(binary_data)
    # # Save the file to a predefined directory
    # file_path = f"uploads/{file.filename}"
    # with open(file_path, "wb") as buffer:
    #     shutil.copyfileobj(file.file, buffer)
    file_data = ""
    print("file data is ",file_data)
    if file_type == ".csv":
        if file:
            df = pd.read_csv(BytesIO(binary_data))
            text_content=df.head(len(df)).to_json()
    elif file_type == ".pdf":
        if file:
            pdf_file = io.BytesIO(binary_data)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text_content = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text()
    elif file_type == ".docx":
        if file:
            decoded_data = Document(io.BytesIO(binary_data))
            text_content = '\n'.join([para.text for para in decoded_data.paragraphs])
    else:
        if file:
            text_content = binary_data.decode('utf-8')
    print("After reading the file name is ", file_data)
    response_line = chatbot(OPENAI_API_KEY, question, text_content , file_type)
    return JSONResponse(content={"result":response_line})

class Response(BaseModel):
    result: str
# @app.post("/predict", response_model=Response)
# def predict() -> Any:
#     # Set your OpenAI API key here
#     openai.api_key = OPENAI_API_KEY

#     # Your logic to process the query using OpenAI's API
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "system", "content": "You are a professional Question and Answer AI Assistant."}],
#         max_tokens=50,
#         temperature=0.7,
#         stop=["\n"],
#     )
#     return {"result": response['choices'][0]['message']['content'].strip() }

# @app.post("/predict", response_model = Response)
# def predict() -> Any:
  
#   #implement this code block
  
#   return {"result": "hello world!"}