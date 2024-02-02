const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const fs = require('fs');
const port = 5000;

app.get('/download', (req, res) => {
  const { videoUrl } = req.query;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid or missing video URL');
  }

  ytdl.getInfo(videoUrl).then(info => {
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').replace(/ /g, '_'); // sanitize title for filename
    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

    ytdl(videoUrl, {
        
      format: 'mp4'
    }).pipe(res);
  }).catch(error => {
    console.error('Error downloading the video:', error);
    res.status(500).send('Failed to download video');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});