const GEMINI_API_KEY = "AIzaSyBSDy68Nyo172fyBLHx7FUZQSkp5t3jbbs";

async function testGeminiAPI() {
  try {
    // First, let's list available models
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    
    if (!modelsResponse.ok) {
      throw new Error(`Models API error! status: ${modelsResponse.status}`);
    }
    
    const modelsData = await modelsResponse.json();
    console.log("Available models:", modelsData.models?.map(m => m.name) || []);
    
    // Try with gemini-2.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Say hello and confirm you're working!"
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("✅ Gemini API is working!");
    console.log("Response:", content);
  } catch (error) {
    console.error("❌ Gemini API test failed:", error.message);
  }
}

testGeminiAPI();