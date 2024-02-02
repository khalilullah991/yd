import React, { useState } from 'react';
import axios from 'axios';

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);

  const fetchVideoInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/videoInfo?videoUrl=${encodeURIComponent(url)}`);
      setFormats(response.data);
    } catch (error) {
      console.error('Error fetching video information:', error);
      // Handle error e.g., display notification to the user
    }
  };

  const handleDownload = (itag) => {
    window.location.href = `http://localhost:5000/download?videoUrl=${encodeURIComponent(url)}&itag=${itag}`;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button onClick={fetchVideoInfo}>Fetch Available Formats</button>
      {formats.length > 0 && (
        <>
          <h3>Select a format to download:</h3>
          <ul>
            {formats.map((format, index) => (
              <li key={index}>
                {format.quality} - {format.container}
                <button onClick={() => handleDownload(format.itag)}>Download</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default VideoDownloader;