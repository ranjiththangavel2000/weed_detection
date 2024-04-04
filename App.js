import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function () {
        const jpegImageUrl = await convertToJpeg(reader.result);
        setImageUrl(jpegImageUrl);
        setIsResultVisible(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToJpeg = async (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const jpegUrl = URL.createObjectURL(blob);
          resolve(jpegUrl);
        }, 'image/jpeg');
      };
      img.src = dataUrl;
    });
  };

  const handleAnalyzeClick = () => {
    setIsLoading(true); // Set loading state to true
    setTimeout(() => {
      setIsLoading(false); // Set loading state to false after 5 seconds
      const data = { is_weed_detected: true }; // Mock response data

      if (data.error) {
        setResultMessage('Error analyzing image.');
      } else {
        const message = data.is_weed_detected ? 'Weed Detected!' : 'No Weed Detected';
        setResultMessage(message);
        setIsResultVisible(true); // Show result only after loading completes
      }
    }, 5000); // 5 seconds timeout
  };

  return (
    <>
      <center>
        <div className="content">
          <h1 className="title">🌿 WEEDS DETECTION 🌿</h1>
          <div id="uploadContainer">
            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
            <label htmlFor="imageUpload"></label>
            <button id='btn' onClick={handleAnalyzeClick}>Analyze Image</button>
          </div>
          {imageUrl && (
            <div id="imagePreviewContainer">
              <h2 id='ipc'>UPLOAD IMAGE:</h2>
              <img id="imagePreview" src={imageUrl} alt="Uploaded" />
            </div>
          )}
          {isLoading && ( // Display loading animation if isLoading is true
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}
          {isResultVisible && ( // Display result only when isResultVisible is true
            <div id="resultContainer">
              <h2>ANALYSIS RESULT:</h2>
              <div id="resultText" className={resultMessage === 'Weed Detected!' ? 'weedDetected' : 'weedNotDetected'}>
                {resultMessage}
              </div>
            </div>
          )}
        </div>
      </center>
    </>
  );
}

export default App;
