import Groq from 'groq-sdk'
import envConfig from '../config/env.config'
import { AiBlogConfigurationTypes } from '../common/types/aifunctions.type';

const groq = new Groq({ apiKey: envConfig.GROQ_API_KEY })


// ── JSON Schema for structured output ────────────────────────────────────────
const BLOG_IDEA_SCHEMA = {
  type: "object",
  properties: {
    blog_ideas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "A catchy, SEO-friendly blog title"
          },
          outline: {
            type: "object",
            description: "The complete structure of the blog post. MUST contain introduction, body_sections, and conclusion — all three are required.",
            properties: {
              introduction: {
                type: "string",
                description: "A brief summary of what the introduction will cover."
              },
              body_sections: {
                type: "array",
                description: "The main body sections. Do NOT include introduction or conclusion here.",
                items: {
                  type: "object",
                  properties: {
                    section_heading: { type: "string", description: "The heading for this section." },
                    key_points: {
                      type: "array",
                      description: "Bullet points to cover in this section.",
                      items: { type: "string" }
                    }
                  },
                  required: ["section_heading", "key_points"],
                  additionalProperties: false
                }
              },
              conclusion: {
                type: "string",
                description: "A closing summary with final thoughts and a call to action. This field is REQUIRED."
              }
            },
            required: ["introduction", "body_sections", "conclusion"],
            additionalProperties: false
          }
        },
        required: ["title", "outline"],
        additionalProperties: false
      }
    }
  },
  required: ["blog_ideas"],
  additionalProperties: false
};

// ── Retry helper ─────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;

async function callWithRetry(fn: () => Promise<any>, attempt = 1): Promise<any> {
  try {
    return await fn();
  } catch (err: any) {
    const isSchemaError = err?.error?.error?.code === 'json_validate_failed'
      || err?.status === 400;

    if (isSchemaError && attempt < MAX_RETRIES) {
      const delay = attempt * 800; // 800ms, 1600ms
      console.warn(`[Groq] json_validate_failed — retrying (attempt ${attempt + 1}/${MAX_RETRIES}) in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, attempt + 1);
    }

    throw err;
  }
}

//Glog Idea and Outline generator function.
export const generateBlogIdeas = async (params: AiBlogConfigurationTypes) => {
  const response = await callWithRetry(() =>
    groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: [
            `You are an expert content strategist. Generate exactly 3 blog post ideas based on the user's parameters.`,
            `CRITICAL RULES — you MUST follow these for every single idea:`,
            `1. Every outline object MUST contain all three fields: "introduction", "body_sections", and "conclusion".`,
            `2. The "conclusion" field must NEVER be omitted, even if the response is long.`,
            `3. Do NOT include introduction or conclusion inside body_sections.`,
            `4. The outline should be tailored to hit the target word count.`,
          ].join(' ')
        },
        {
          role: "user",
          content: `Topic: ${params.topic}
Keywords: ${params.keywords.join(", ")}
Categories: ${params.categories}
Tone: ${params.writing_tone}
Target Word Count: ${params.word_count}
Target Audience: ${params.target_audience}

Remember: every outline MUST have introduction, body_sections, AND conclusion.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "blog_ideation_array",
          strict: true,
          schema: BLOG_IDEA_SCHEMA
        }
      }
    })
  );

  return {
    usage: response.usage?.total_tokens,
    ai_response: JSON.parse(response.choices[0].message.content || "{}")
  };
};
