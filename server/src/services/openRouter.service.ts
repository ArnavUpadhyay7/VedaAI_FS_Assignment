import axios from "axios";
import { env } from "../config/env";
import { aiOutputSchema, type ValidatedAiOutput } from "../validators/aiOutput.validator";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// switch to openrouter/auto if the model is not available
const MODEL = "google/gemini-2.0-flash-001";

export async function generateAssessment(prompt: string): Promise<ValidatedAiOutput> {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert assessment creator. Return only valid JSON matching the required schema. Do not include markdown or explanations.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.CLIENT_URL,
        "X-Title": "VedaAI Assessment Creator",
      },
      timeout: 120_000,
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenRouter returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("OpenRouter response was not valid JSON");
  }

  const validated = aiOutputSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("AI output did not match the required schema");
  }

  return validated.data;
}
