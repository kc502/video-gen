const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-video', async (req, res) => {
    const { prompt, apiKey } = req.body;

    // Check if both prompt and API key are provided
    if (!prompt || !apiKey) {
        return res.status(400).json({ error: 'Prompt and API key are required.' });
    }

    try {
        // Step 1: Use Gemini to enhance the prompt
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await model.generateContent(`အောက်ပါစာသားကို ဗီဒီယိုဖန်တီးနိုင်မယ့် အသေးစိတ် English prompt အဖြစ်ပြောင်းလဲပေးပါ။ စာသား: "${prompt}"`);
        const enhancedPrompt = result.response.text();

        console.log('Enhanced Prompt from Gemini:', enhancedPrompt);

        // Step 2: Placeholder for video generation logic
        // In a real application, you would call a third-party video generation API here
        // (e.g., Replicate, Pika Labs, etc.) using the 'enhancedPrompt'.
        // For this example, we'll create a dummy video file.

        const videoFileName = `video-${Date.now()}.mp4`;
        const videoDir = path.join(__dirname, 'public', 'videos');
        const videoFilePath = path.join(videoDir, videoFileName);
        
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir);
        }

        // Dummy file content for demonstration
        fs.writeFileSync(videoFilePath, 'This is a dummy video file.');

        const videoUrl = `/videos/${videoFileName}`;
        res.json({
            enhancedPrompt: enhancedPrompt,
            videoUrl: videoUrl
        });

    } catch (error) {
        console.error('Error generating video:', error);
        res.status(500).json({ error: 'Failed to generate video. Please check your API key and prompt.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
