import Groq from 'groq-sdk'
import envConfig from '../config/env.config'
import { AiBlogConfigurationTypes } from '../common/types/aifunctions.type';

const groq = new Groq({ apiKey: envConfig.GROQ_API_KEY })

export const getGroqChatCompletion = async () => {
  return groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "openai/gpt-oss-20b",
  });
};



export const generateBlogIdeas = async (params:AiBlogConfigurationTypes) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b", // Use a model that supports strict: true
    messages: [
      {
        role: "system",
        content: `You are an expert content strategist. Generate exactly 3 blog post ideas based on the user's parameters. The outline should be tailored to ultimately hit the target word count.`
      },
      {
        role: "user",
        content: `Topic: ${params.topic}
                  Keywords: ${params.keywords.join(", ")}
                  Categories:${params.categories}
                  Tone: ${params.writing_tone}
                  Target Word Count: ${params.word_count}
                  Target Audience: ${params.target_audience}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "blog_ideation_array",
        strict: true,
        schema: {
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
                    description: "The complete structure of the blog post.",
                    properties: {
                      introduction: {
                        type: "string",
                        description: "A brief summary of what the introduction will cover."
                      },
                      body_sections: {
                        type: "array",
                        description: "The main sections of the blog post.Introduction and Conclusion should not included in the body section.",
                        items: {
                          type: "object",
                          properties: {
                            section_heading: {
                              type: "string",
                              description: "The title of this specific section."
                            },
                            key_points: {
                              type: "array",
                              description: "Bullet points to cover in this section.",
                              items: { type: "string" }
                            }
                          },
                          required: ["section_heading", "key_points"],
                          additionalProperties: false // Crucial for Strict Mode
                        }
                      },
                      conclusion: {
                        type: "string",
                        description: "A summary of the final thoughts and call to action."
                      }
                    },
                    required: ["introduction", "body_sections", "conclusion"], // Guarantees they are always present
                    additionalProperties: false // Crucial for Strict Mode
                  }
                },
                required: ["title", "outline"],
                additionalProperties: false // Required for Strict Mode
              }
            }
          },
          required: ["blog_ideas"],
          additionalProperties: false // Required for Strict Mode
        }
      }
    }
  });

  // 3. Parse the guaranteed JSON
  //const result = JSON.parse(response.choices[0].message.content || "{}");
  return {usage:response.usage?.total_tokens,ai_response:JSON.parse(response.choices[0].message.content || "{}")}
}

