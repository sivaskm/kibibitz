import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VideoUploader() {
  const [files, setFiles] = useState([]);
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('idle');
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await axios.post('http://3.89.25.121:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setJobId(response.data.job_id);
      setStatus('processing');
    } catch (error) {
      console.error('Error uploading files:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (jobId && status === 'processing') {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`http://3.89.25.121:8000/jobs/${jobId}`, { responseType: 'blob' });
          if (response.status === 200) {
            setStatus('completed');
            // Create a URL for the download link
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
            setDownloadLink(url);
          }
        } catch (error) {
          console.error('Error checking job status:', error.response ? error.response.data : error.message);
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [jobId, status]);

  return (
    <div>
      <h1>Video Uploader</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload</button>

      {jobId && <p>Job ID: {jobId}</p>}
      {status === 'processing' && <p>Processing...</p>}
      {status === 'completed' && (
        <a href={downloadLink} download={`combined_${jobId}.mp4`}>Download Combined Video</a>
      )}
    </div>
  );
}

export default VideoUploader;

