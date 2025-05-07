const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

app.post('/receive', (req, res) => {
    const data = req.body;
    fs.appendFileSync('youtube_urls.txt', JSON.stringify(data) + '\n');

    const python = spawn('python', ['fetch_transcript.py']);
    python.stdin.write(JSON.stringify(data));
    python.stdin.end();

    python.stdout.on('data', (output) => {
        console.log(`Python output: ${output.toString()}`);
    });

    python.stderr.on('data', (err) => {
        console.error(`Python error: ${err.toString()}`);
    });

    python.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

    res.json({ status: 'received and sent to Python' });
});

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});
