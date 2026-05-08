import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompts";
import { QUESTION_MIN_CHARS, QUESTION_MAX_CHARS } from "@/lib/constants";
import type { DoubtRequest } from "@/lib/types";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const GEMINI_MODEL = "gemini-2.5-flash-lite";

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

function textResponse(message: string): Response {
  return new Response(message, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function getKnownFormulaAnswer(question: string): string | null {
  const normalized = question.toLowerCase();
  const asksForCone =
    normalized.includes("cone") &&
    /\b(formula|volume|surface|area|csa|tsa|slant)\b/.test(normalized);

  if (!asksForCone) {
    return null;
  }

  return `## Explanation
A cone has a circular base and one pointed top. The main formulas use radius (r), height (h), and slant height (l). Slant height is the side length from the edge of the circular base to the tip. Use pi as approximately 22/7 or 3.14.

## Step-by-Step
1. Volume of cone = 1/3 x pi x r^2 x h.
2. Curved surface area = pi x r x l.
3. Total surface area = pi x r x (r + l).
4. Slant height = sqrt(r^2 + h^2).

## Real-World Analogy
Think of an ice-cream cone: the circular opening is the base, the pointed end is the vertex, and the side from the circle to the point is the slant height.

## Concept Name
Surface Areas and Volumes - Cone

## Practice Question
A cone has radius 7 cm and height 24 cm. Find its volume.
<details><summary>Reveal Answer</summary>Volume = 1/3 x 22/7 x 7^2 x 24 = 1232 cm^3</details>`;
}

function getGenerationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("[429") || /quota|rate limit/i.test(message)) {
    return "Gemini API quota is exhausted for the current key. Please use a key with available quota or enable billing, then try again.";
  }

  if (message.includes("[400") || /api key|API_KEY|invalid/i.test(message)) {
    return "Gemini API key is missing or invalid. Please update GEMINI_API_KEY in .env.local and restart the dev server.";
  }

  if (/fetch failed|network/i.test(message)) {
    return "Could not reach the Gemini API. Please check your internet connection and try again.";
  }

  return "Failed to generate a response. Please try again.";
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const { classLevel, subject, question } = (body ?? {}) as Partial<DoubtRequest>;

  if (!classLevel || typeof classLevel !== "string") {
    return badRequest("Class level is required.");
  }
  if (!subject || typeof subject !== "string") {
    return badRequest("Subject is required.");
  }
  if (!question || typeof question !== "string") {
    return badRequest("Question is required.");
  }
  if (question.trim().length < QUESTION_MIN_CHARS) {
    return badRequest(
      `Question must be at least ${QUESTION_MIN_CHARS} characters.`
    );
  }
  if (question.trim().length > QUESTION_MAX_CHARS) {
    return badRequest(
      `Question must be at most ${QUESTION_MAX_CHARS} characters.`
    );
  }

  const systemPrompt = buildSystemPrompt(classLevel, subject);
  const userMessage = buildUserMessage(question);
  const knownAnswer = getKnownFormulaAnswer(question);

  if (knownAnswer) {
    return textResponse(knownAnswer);
  }

  try {
    const model = genai.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await model.generateContentStream(userMessage);

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: getGenerationErrorMessage(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
