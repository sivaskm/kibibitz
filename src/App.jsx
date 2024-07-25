// src/App.js
import React from "react";
import UploadForm from "./components/UploadForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">Video File Combiner</h1>
          <UploadForm />
        </div>
      </div>
    </div>
  );
}

export default App;

