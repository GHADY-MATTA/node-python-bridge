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
