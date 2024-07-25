import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

function VideoUploader() {
  const [files, setFiles] = useState([]);
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('idle');
  const [downloadLink, setDownloadLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);

    try {
      const response = await axios.post('https://ec2-3-89-25-121.compute-1.amazonaws.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setJobId(response.data.job_id);
      setStatus('processing');
    } catch (error) {
      console.error('Error uploading files:', error.response ? error.response.data : error.message);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (jobId && status === 'processing') {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`https://ec2-3-89-25-121.compute-1.amazonaws.com/jobs/${jobId}`, { responseType: 'blob' });
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
      <div className="mb-3">
        <label htmlFor="formFileMultiple" className="form-label">Upload Videos</label>
        <input className="form-control" type="file" id="formFileMultiple" multiple onChange={handleFileChange} />
      </div>
      <button className="btn btn-primary" onClick={uploadFiles} disabled={isUploading}>
        {isUploading ? (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : 'Upload'}
      </button>

      {jobId && <p className="mt-3">Job ID: {jobId}</p>}
      {status === 'processing' && (
        <div className="mt-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Processing...</span>
          </Spinner>
          <p>Processing...</p>
        </div>
      )}
      {status === 'completed' && (
        <div className="mt-3">
          <a className="btn btn-success" href={downloadLink} download={`combined_${jobId}.mp4`}>Download Combined Video</a>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;

