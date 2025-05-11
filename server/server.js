const express = require('express');
const fs = require('fs');
const path = require('path');
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
        outputData += output.toString();
        console.log(`Python output: ${output.toString()}`);
    });

    python.stderr.on('data', (err) => {
        console.error(`Python error: ${err.toString()}`);
    });

    python.on('close', async (code) => {
        console.log(`Python script exited with code ${code}`);

        try {
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

            const summaryData = JSON.stringify(response.data.summary, null, 2);
            const safeFileName = data.youtube_url.replace(/[^a-z0-9]/gi, '_') + '.txt';
            const folder = path.join(__dirname, 'summaries');
            const filePath = path.join(folder, safeFileName);

            fs.mkdirSync(folder, { recursive: true });
            fs.writeFileSync(filePath, summaryData, 'utf8');

            console.log(`📁 AI summary saved to: ${filePath}`);

            // ✅ Final response to React
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
    });
});

app.listen(3000, () => {
    console.log('🚀 Node server listening at http://localhost:3000');
});
