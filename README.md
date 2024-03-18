# Project Overview and Approach

## Project Description

The goal of this application is to create an AI assistant that can answer questions and summarize information from uploaded files containing large amounts of text data. The application comprises a backend written in Python and a frontend written in TypeScript, offering a user-friendly interface to interact with the AI assistant.

## Approach

### Backend
- **Python 3.10:** Chosen as the backend language due to its efficiency in handling text processing and AI capabilities.
- **FastAPI Framework:** Selected for its asynchronous support, high performance, and ease of use in creating RESTful APIs.
- **OpenAI GPT-3.5 Turbo Model:** Utilized for its advanced natural language processing capabilities to generate accurate responses.
- **File Handling:** Supported various file types such as CSV, PDF, DOCX, and plain text files for flexibility in data input.
- **Middleware:** Integrated CORS middleware to allow cross-origin requests for seamless frontend-backend communication.
- **Environment Variables:** Leveraged dotenv for loading sensitive API keys securely from a `.env` file.

### Frontend
- **React:** Chosen for its component-based architecture, state management capabilities, and efficient UI rendering.
- **File Upload:** Implemented file upload functionality with size validation to ensure smooth user experience.
- **Form Handling:** Utilized React state hooks for managing form inputs and handling form submission.
- **API Integration:** Communicated with the backend API using Fetch API to send file data and questions for processing.
- **User Interface:** Designed a simple and intuitive user interface for users to upload files, ask questions, and view responses.

## Workflow

1. User navigates to the frontend interface hosted locally at [http://localhost:3000](http://localhost:3000).
2. User selects a file (CSV, PDF, DOCX, or plain text) and inputs a question in the provided form.
3. User clicks the "Submit" button, triggering a POST request to the backend API endpoint (`/predict/`).
4. Backend processes the uploaded file and question, interacts with the OpenAI GPT-3.5 Turbo model, and generates a response.
5. Backend sends the response back to the frontend, which displays the result to the user.

## Commands

To set up and run the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Set up the backend:
   ```
   cd backend
   conda create -n chatbot python=3.10
   conda activate chatbot
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   npm start
   ```

4. Access the application in your browser at [http://localhost:3000](http://localhost:3000).

## Conclusion

This project combines the power of Python for backend processing, FastAPI for API development, OpenAI's GPT-3.5 Turbo model for natural language understanding, and React for creating an interactive user interface. The chosen technologies and approach ensure efficient data handling, seamless communication between frontend and backend, and an intuitive user experience.