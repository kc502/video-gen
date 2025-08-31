document.getElementById('generateBtn').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const videoOutput = document.getElementById('video-output');
    const enhancedPromptP = document.getElementById('enhanced-prompt');
    const downloadBtn = document.getElementById('download-btn');

    if (!prompt || !apiKey) {
        alert('Prompt နဲ့ API Key ကို ထည့်သွင်းပေးပါ');
        return;
    }

    // Hide previous results and show loading indicator
    resultDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        const response = await fetch('/generate-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, apiKey })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        
        // Update the UI with the results
        enhancedPromptP.textContent = `Gemini ကနေ ပြင်ဆင်ပေးထားတဲ့ Prompt: ${data.enhancedPrompt}`;
        videoOutput.src = data.videoUrl;
        
        // Set up the download link
        downloadBtn.href = data.videoUrl;
        downloadBtn.classList.remove('hidden');

        // Show the results
        loadingDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');

    } catch (error) {
        alert('ဗီဒီယို ဖန်တီးရာတွင် အမှားအယွင်း ရှိနေပါသည်။');
        console.error('Error:', error);
        loadingDiv.classList.add('hidden');
    }
});
