import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

   switch (type) {
  case "summary":
    systemPrompt =
      "You are an expert resume writer. Generate ONLY a professional, ATS-friendly resume summary. The output must be 2–4 sentences. Do NOT include headings, explanations, options, bullet points, markdown, or analysis. Return plain text only.";

    userPrompt = context.currentContent
      ? `Rewrite the following resume summary to be more professional, concise, and ATS-optimized. Keep it within 2–4 sentences. Text: ${context.currentContent}`
      : `Write a professional 2–4 sentence resume summary for ${
          context.name || "a final-year Computer Science Engineering student"
        } with full-stack web development skills. Return plain text only.`;
    break;

  case "experience":
    systemPrompt =
      "You are an expert resume writer. Generate ONLY ATS-friendly resume bullet points. Do NOT include explanations, headings, or extra text.";

    userPrompt = context.currentBullets?.length
      ? `Improve the following resume bullets to be more impactful and ATS-optimized: ${context.currentBullets.join(
          "; "
        )}`
      : `Generate 3–5 strong resume bullet points for a ${context.position} at ${context.company}.`;
    break;

  case "improve":
  systemPrompt =
    "You are an expert resume writer. Rewrite the given resume content to be professional, concise, and ATS-friendly. Output ONLY the rewritten text as a single paragraph. Do not include options, symbols, bullet points, headings, or explanations.";

 userPrompt = `Rewrite the following resume content while preserving its original meaning. Produce a strong, professional single paragraph of 3–4 lines only. Do not use bullet points, symbols, stars, headings, or multiple paragraphs. Return only the rewritten text: ${context.currentContent}`;

  break;


  default:
    throw new Error("Invalid type");
}



    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
