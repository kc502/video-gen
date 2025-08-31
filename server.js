const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
// Cloud server တွေအတွက် process.env.PORT ကိုသုံးပါတယ်။ Local မှာစမ်းသပ်ရင်တော့ 3000 ကိုသုံးပါမယ်။
const port = process.env.PORT || 3000;

// Middleware
// Frontend နဲ့ Backend မတူတဲ့ domains တွေမှာရှိတဲ့အခါ ချိတ်ဆက်နိုင်ဖို့ CORS ကိုအသုံးပြုပါတယ်။
app.use(cors());
app.use(express.json());

// Serving static files from the 'public' directory
// Frontend (HTML, CSS, JS) files တွေကိုဒီကနေတဆင့် serve လုပ်ပေးပါတယ်။
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-video', async (req, res) => {
    // Frontend ကနေပို့လိုက်တဲ့ data (prompt, apiKey) ကိုရယူပါတယ်။
    const { prompt, apiKey } = req.body;

    // input တွေအပြည့်အစုံပါမပါစစ်ဆေးပါတယ်။
    if (!prompt || !apiKey) {
        return res.status(400).json({ error: 'Prompt and API key are required.' });
    }

    try {
        // Step 1: Gemini API နဲ့ချိတ်ဆက်ပါတယ်။
        // Frontend ကနေပေးပို့လိုက်တဲ့ API Key ကိုတိုက်ရိုက်အသုံးပြုပါတယ်။
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Gemini ကို prompt ပေးပြီး ဗီဒီယိုအတွက်အကြောင်းအရာတွေကိုဖန်တီးစေပါတယ်။
        const result = await model.generateContent(`အောက်ပါစာသားကို ဗီဒီယိုဖန်တီးနိုင်မယ့် အသေးစိတ် English prompt အဖြစ်ပြောင်းလဲပေးပါ။ စာသား: "${prompt}"`);
        const enhancedPrompt = result.response.text();

        console.log('Enhanced Prompt from Gemini:', enhancedPrompt);

        // Step 2: ဗီဒီယိုဖန်တီးခြင်း
        // ဒီနေရာမှာတော့ စမ်းသပ်ရန်အတွက်သာ dummy video file တစ်ခုဖန်တီးပေးထားပါတယ်။
        // လက်တွေ့မှာတော့ Replicate လိုမျိုး Third-party API ကိုသုံးပြီး ဗီဒီယိုဖန်တီးရမှာဖြစ်ပါတယ်။
        const videoFileName = `video-${Date.now()}.mp4`;
        const videoDir = path.join(__dirname, 'public', 'videos');
        const videoFilePath = path.join(videoDir, videoFileName);
        
        // videos folder ရှိမရှိစစ်ဆေးပြီး မရှိသေးရင်ဖန်တီးပါတယ်။
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir);
        }

        // dummy file ကိုရေးသားပါတယ်။
        fs.writeFileSync(videoFilePath, 'This is a dummy video file for demonstration purposes.');

        // Step 3: Frontend ကို video ရဲ့ URL နဲ့ပြန်ပို့ပေးပါတယ်။
        // Browser ကနေသုံးဖို့အတွက် 'public' folder ထဲက video files တွေကို URL အဖြစ်ပြန်ပေးပါတယ်။
        const videoUrl = `/videos/${videoFileName}`;
        res.json({
            enhancedPrompt: enhancedPrompt,
            videoUrl: videoUrl
        });

    } catch (error) {
        console.error('Error generating video:', error.message);
        // Gemini API key မှားယွင်းရင် error ဖြစ်နိုင်ပါတယ်။
        res.status(500).json({ error: 'Failed to generate video. Please check your API key and prompt.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
