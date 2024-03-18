import { useState } from "react";
import "./App.css";

export default function App() {
  const [result, setResult] = useState();
  const [question, setQuestion] = useState();
  // const [file, setFile] = useState();
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileType, setFileType] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");


  const handleFileTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(event.target.value);
  };
  
  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  // const handleFileChange = (event: any) => {
  //   setFile(event.target.files[0]);
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  };

  // const handleSubmit = async(event: any) => {
  //   event.preventDefault();

  //   const formData = new FormData();

  //   if (file) {
  //     formData.append("file", file);
  //   }
  //   if (question) {
  //     formData.append("question", question);
  //   }
    
  //   const url =  "http://127.0.0.1:8000/upload";

  
  //   const response =  await fetch(url, {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) =>response.json())
     
  //     .then((data) => {
  //       setResult(data.result)
  //       console.log("data",data.result)
  //       setShowNotification(true);
  //       setNotificationContent("File uploaded successfully!");
  //       setTimeout(() => {
  //       setShowNotification(false);
  //       setNotificationContent("");
  //     }, 3000); // Hide notification after 3 seconds
  //     })
  //     .catch((error) => {
  //       console.error("Error", error);
  //       setShowNotification(true);
  //       setNotificationContent(error.message); // Display the error message from the backend
  //       setTimeout(() => {
  //       setShowNotification(false);
  //       setNotificationContent("");
  //   }, 3000);
  //     });
  
  // };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
  
    const formData = new FormData();
  
    // if (file) {
    //   formData.append("file", file);
    // }

    // if (file) {
    //   const fileSizeInBytes = file.size;
    //   const maxSizeInBytes = 1 * 1024 * 1024; // 20MB limit
  
    //   if (fileSizeInBytes > maxSizeInBytes) {
    //     setShowNotification(true);
    //     setNotificationContent("File size limit exceeded (max 20MB)");
    //     setTimeout(() => {
    //       setShowNotification(false);
    //       setNotificationContent("");
    //     }, 3000); // Hide notification after 3 seconds
    //     return; // Stop further processing
    //   }
    if (files && files.length > 0) {
      const file = files[0]; // Assuming only one file is selected
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 5 * 1024 * 1024; // 20MB limit

      if (fileSizeInBytes > maxSizeInBytes) {
        setShowNotification(true);
        setNotificationContent("File size limit exceeded (max 20MB)");
        setTimeout(() => {
          setShowNotification(false);
          setNotificationContent("");
        }, 3000); // Hide notification after 3 seconds
        return; // Stop further processing
      }
  
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }
  
    const url = "http://127.0.0.1:8000/predict";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Please upload only pdf, docs ,txt, and csv files.");
      }
  
      const data = await response.json();
      setResult(data.result);
      setShowNotification(true);
      setNotificationContent("File uploaded successfully!");
      setTimeout(() => {
        setShowNotification(false);
        setNotificationContent("");
      }, 3000); // Hide notification after 3 seconds
    } 
    catch (error: any ) {
      console.error("Error", error);
      setShowNotification(true);
      setNotificationContent(error.message); // Display the error message from the backend
      setTimeout(() => {
        setShowNotification(false);
        setNotificationContent("");
      }, 3000);
    }
  };
  

  return (
    <div className="appBlock">
      {showNotification && (
        <div className="notification">
          <p>{notificationContent}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <label className="questionLabel" htmlFor="question">
          Question:
        </label>
        <input
          className="questionInput"
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
        />

        <br></br>
        <label className="fileLabel" htmlFor="file">
          Upload File:(Max. upload 5MB)
        </label>
        <select onChange={handleFileTypeChange} className="fileTypeSelect">
          <option value="">Select File Type</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="docx">Docx</option>
          <option value="txt">Text</option>
        </select>

        <input
          type="file"
          id="file"
          name="file"
          accept={`.${fileType}`}
          onChange={handleFileChange}
          className="fileInput"
        />
        <br></br>
        {/* modifwdfile */}
        <button
          className="submitBtn"
          type="submit"
          disabled={!files || !question || !fileType }   
        >
          Submit
        </button>
      </form>
      <p className="resultOutput">Result: {result}</p>
    </div>
  );
}
