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
