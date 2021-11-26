import './App.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [progressPercentValue, setProgressPercentValue] = useState(0);
  const [fileLink, setFileLink] = useState('');
  const fileRef = useRef();
  const bgProgressRef = useRef();
  const progressBarRef = useRef();
  const progressContainerRef = useRef();
  const sharingContainerRef = useRef();
  const fileURLInput = useRef();

  const uploadFile = async () => {
    progressContainerRef.current.style.display = 'block';
    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append('myFile', file);
    console.log('formData', formData);
    const config = {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgressPercentValue(percent);
        // console.log(percent);
        bgProgressRef.current.style.width = `${percent}%`;
        progressBarRef.current.style.transform = `scaleX(${percent / 100})`;
      },
    };
    const { data } = await axios.post(
      `https://inshare-dev.herokuapp.com/api/files`,
      formData,
      config
    );
    console.log('Res', data);
    if (data) {
      setFileLink(data.file);
      progressContainerRef.current.style.display = 'none';
      sharingContainerRef.current.style.display = 'block';
      fileRef.current.value = '';
    }
  };

  return (
    <>
      <img src="assets/logo.png" alt="Inshare logo" className="logo" />
      <div className="main-container">
        <section className="upload-container">
          <form action="">
            <div
              className={isDragging ? 'drop-zone dragged' : 'drop-zone'}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                console.log(files);
                if (files.length > 0) {
                  fileRef.current.files = files;
                  uploadFile();
                }
              }}
            >
              <div className="icon-container">
                <img
                  src="assets/file.svg"
                  draggable="false"
                  className="center"
                  alt="File Icon"
                />
                <img
                  src="assets/file.svg"
                  draggable="false"
                  className="left"
                  alt="File Icon"
                />
                <img
                  src="assets/file.svg"
                  draggable="false"
                  className="right"
                  alt="File Icon"
                />
              </div>
              <input
                type="file"
                id="fileInput"
                ref={fileRef}
                onChange={() => uploadFile()}
              />
              <div className="title">
                Drop your Files here or,{' '}
                <span
                  id="browseBtn"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                >
                  browse
                </span>
              </div>
            </div>
          </form>
          <div className="progress-container" ref={progressContainerRef}>
            <div className="bg-progress" ref={bgProgressRef}></div>

            <div className="inner-container">
              <div className="status">Uploading...</div>
              <div className="percent-container">
                <span className="percentage" id="progressPercent">
                  {progressPercentValue}
                </span>
                %
              </div>
              <div className="progress-bar" ref={progressBarRef}></div>
            </div>
          </div>
          <div className="sharing-container" ref={sharingContainerRef}>
            <p className="expire">Link expires in 24 hrs</p>

            <div className="input-container">
              <input
                ref={fileURLInput}
                type="text"
                id="fileURL"
                value={fileLink}
                readOnly
              />
              <img
                src="assets/copy-icon.svg"
                id="copyURLBtn"
                alt="copy to clipboard icon"
                onClick={() => {
                  fileURLInput.current.select();
                  document.execCommand('copy');
                }}
              />
            </div>
          </div>
        </section>
        <div className="image-vector">
          <img
            className="img-vector"
            src="./assets/undraw-upload.svg"
            alt="logo"
          />
        </div>
      </div>
    </>
  );
}

export default App;
