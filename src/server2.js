const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const cors = require('cors');
const port = 5000;
app.use(cors());

// New endpoint to get available video formats
app.get('/videoInfo', async (req, res) => {
  const { videoUrl } = req.query;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid or missing video URL');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const videoFormats = formats.map(format => ({
      itag: format.itag,
      quality: format.qualityLabel,
      container: format.container,
      url: format.url
    }));

    res.json(videoFormats);
  } catch (error) {
    console.error('Error getting video information:', error);
    res.status(500).send('Failed to get video information');
  }
});

// Download endpoint
app.get('/download', (req, res) => {
  const { videoUrl, itag } = req.query;
  
  // Re-validate here if desired
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(videoUrl, { itag }).pipe(res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});