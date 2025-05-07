const express = require('express');
const fs = require('fs');
const { spawn } = require('child_process');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/receive', (req, res) => {
    const data = req.body;
    fs.appendFileSync('youtube_urls.txt', JSON.stringify(data) + '\n');

    const python = spawn('python', ['fetch_transcript.py']);
    python.stdin.write(JSON.stringify(data));
    python.stdin.end();

    let outputData = '';

    python.stdout.on('data', (output) => {
        const out = output.toString();
        outputData += out;
        console.log(`Python output: ${out}`);
    });

    python.stderr.on('data', (err) => {
        console.error(`Python error: ${err.toString()}`);
    });

    python.on('close', async (code) => {
        console.log(`Python script exited with code ${code}`);

        try {
            const parsed = JSON.parse(outputData);

            const transcriptText = parsed.transcript
                .map(line => line.text)
                .join('\n');

            const response = await axios.post(
                'http://127.0.0.1:8000/api/receive-transcript',
                {
                    video_id: parsed.video_id,
                    title: parsed.title,
                    transcript_raw: transcriptText
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log('✅ Forwarded to Laravel:', response.data);
        } catch (err) {
            console.error('❌ Failed to forward to Laravel:', err.message);
        }
    });

    res.json({ status: 'received and sent to Python' });
});

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});
