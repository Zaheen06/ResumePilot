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
      "You are an expert resume writer. Rewrite the given resume content into a single paragraph of exactly 3-4 sentences. IMPORTANT: Return ONLY the rewritten paragraph text. Do NOT include any of the following: options, alternatives, explanations, markdown formatting, bullet points, headings, labels, or meta-commentary. Just output the paragraph text directly.";

    userPrompt = `Rewrite this resume content into a single professional paragraph of exactly 3-4 sentences. Make it more impactful and ATS-optimized while preserving the original meaning. Return ONLY the paragraph text, nothing else: ${context.currentContent}`;
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
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Post-process content for "improve" type to ensure single paragraph format
    if (type === "improve" && content) {
      // Strategy: Extract the first blockquote paragraph (Option 1) and return it clean
      
      // Find blockquotes with bold text - format: "> **text**" (can span multiple lines)
      // Match: ">" followed by optional whitespace, then "**", then content (including newlines), then "**"
      const blockquoteRegex = />\s*\*\*([\s\S]*?)\*\*/g;
      const blockquoteMatches = [...content.matchAll(blockquoteRegex)];
      
      if (blockquoteMatches.length > 0) {
        // Take the first blockquote content (Option 1)
        content = blockquoteMatches[0][1].trim();
      } else {
        // Fallback: try to find blockquotes without bold markers
        // Match lines starting with ">" until we hit a blank line or another ">"
        const simpleBlockquoteRegex = />\s*([^\n>]+(?:\n[^>\n]+)*?)(?=\n\n|\n>|$)/gs;
        const simpleMatches = [...content.matchAll(simpleBlockquoteRegex)];
        if (simpleMatches.length > 0) {
          content = simpleMatches[0][1].trim();
        }
      }
      
      // If still no good content, try to find the first substantial paragraph
      if (!content || content.length < 50) {
        // Look for lines that are actual sentences (contain periods and are substantial)
        const lines = content.split(/\n+/).map(l => l.trim()).filter(l => l.length > 30);
        const paragraphLines: string[] = [];
        
        for (const line of lines) {
          // Skip option labels and explanations
          if (line.match(/^(option|version|alternative|choice|here'?s?|why|key|ranging)/i)) continue;
          if (line.match(/^---/)) continue;
          
          // If line has sentences, it's likely content
          if (line.includes(".") && line.length > 50) {
            paragraphLines.push(line);
            const sentenceCount = (line.match(/\./g) || []).length;
            if (sentenceCount >= 3) break; // Found a good paragraph
          }
        }
        
        if (paragraphLines.length > 0) {
          content = paragraphLines[0];
        }
      }
      
      // Remove ALL markdown formatting
      content = content
        .replace(/\*\*/g, "") // Remove bold markdown
        .replace(/\*/g, "") // Remove asterisks
        .replace(/__/g, "") // Remove underline markdown
        .replace(/#{1,6}\s+/g, "") // Remove markdown headers
        .replace(/^[-*+]\s+/gm, "") // Remove bullet points
        .replace(/^\d+\.\s+/gm, "") // Remove numbered lists
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/`/g, "") // Remove inline code markers
        .replace(/^>\s*/gm, "") // Remove blockquote markers
        .replace(/\s+/g, " ") // Multiple spaces/newlines to single space
        .trim();
      
      // Ensure it ends with a period
      if (content && !content.endsWith(".")) {
        content += ".";
      }
      
      // Ensure it's 3-4 sentences (trim if too many)
      const sentenceCount = (content.match(/\./g) || []).length;
      if (sentenceCount > 4) {
        const sentences = content.split(/\.\s+/).filter(s => s.trim());
        if (sentences.length >= 3) {
          content = sentences.slice(0, 4).join(". ") + ".";
        }
      }
    }

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
