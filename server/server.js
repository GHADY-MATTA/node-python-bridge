const express = require('express');
const app = express();
app.listen(3000, () => {
    console.log('Server is running');
});
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.post('/receive', (req, res) => {
    const data = req.body;
    console.log(data);
});
const fs = require('fs');
fs.appendFileSync('youtube_urls.txt', JSON.stringify(data) + '\n');
const fs = require('fs');
fs.appendFileSync('youtube_urls.txt', JSON.stringify(data) + '\n');
const { spawn } = require('child_process');
const python = spawn('python', ['fetch_transcript.py']);
python.stdin.write(JSON.stringify(data));
python.stdin.end();
let outputData = '';
python.stdout.on('data', (output) => {
    outputData += output.toString();
});
python.stderr.on('data', (err) => {
    console.error(`Python error: ${err.toString()}`);
});
python.on('close', async (code) => {
    console.log(`Python script exited with code ${code}`);
});
const parsed = JSON.parse(outputData);
if (!parsed.transcript) {
    return res.status(400).json({
        status: false,
        message: 'Transcript not found in Python output',
        error: parsed.error || 'Transcript missing'
    });
}
const transcriptText = parsed.transcript.map(line => line.text).join('\n');
const response = await axios.post(
    'http://52.47.190.216:8000/api/receive-transcript',
    {
        video_id: parsed.video_id,
        title: parsed.title,
        transcript_raw: transcriptText
    },
    {
        headers: { 'Content-Type': 'application/json' }
    }
);
const summaryData = JSON.stringify(response.data.summary, null, 2);
const safeFileName = data.youtube_url.replace(/[^a-z0-9]/gi, '_') + '.txt';
const folder = path.join(__dirname, 'summaries');
fs.mkdirSync(folder, { recursive: true });
const filePath = path.join(folder, safeFileName);
fs.writeFileSync(filePath, summaryData, 'utf8');
console.log(`📁 AI summary saved to: ${filePath}`);
res.json({
    status: true,
    message: 'Transcript summarized successfully',
    video_id: parsed.video_id,
    summary: response.data.summary || null
});
} catch (err) {
    console.error('❌ Failed in pipeline:', err.message);
    res.status(500).json({
        status: false,
        message: 'Server error while processing transcript',
        error: err.message
    });
}
app.listen(3000, () => {
    console.log('🚀 Node server listening at http://localhost:3000');
});
app.post('/receive', (req, res) => {
    console.log('Received data:', req.body);
});
try {
    fs.appendFileSync('youtube_urls.txt', JSON.stringify(data) + '\n');
} catch (err) {
    console.error('❌ Failed to write to file:', err.message);
}
if (!fs.existsSync('youtube_urls.txt')) {
    console.log('File does not exist');
}
python.on('close', (code) => {
    if (code !== 0) {
        console.error(`Python script failed with code ${code}`);
    }
});
if (!parsed.transcript) {
    return res.status(400).json({
        status: false,
        message: 'Transcript not found'
    });
}
console.log('API response received:', response.data);
if (!data || !data.youtube_url) {
    return res.status(400).json({
        status: false,
        message: 'Invalid data received'
    });
}
const youtubeUrlPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/)[a-zA-Z0-9_-]{11}$/;
if (!youtubeUrlPattern.test(data.youtube_url)) {
    return res.status(400).json({
        status: false,
        message: 'Invalid YouTube URL'
    });
}
function logError(message) {
    console.error('Error:', message);
}
function logSuccess(message) {
    console.log('Success:', message);
}
catch (err) {
    logError('Failed in pipeline:', err.message);
    res.status(500).json({
        status: false,
        message: 'Server error while processing transcript',
        error: err.message
    });
}
