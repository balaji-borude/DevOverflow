// import handleError from '@/lib/handlers/errors';
// import { ValidationError } from '@/lib/http-errors';
// import { AIAnswerSchema } from '@/lib/validations';
// import { openai } from '@ai-sdk/openai';
// import { generateText } from 'ai';
// import { NextResponse } from 'next/server';

// export const runtime = 'edge';

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();

//         const validatedData = AIAnswerSchema.safeParse(body);

//         if (!validatedData.success) {
//             throw new ValidationError(
//                 validatedData.error.flatten().fieldErrors
//             );
//         }

//         const { question, content } = validatedData.data;

//         const { text } = await generateText({
//             model: openai('gpt-4o-mini'),
//             prompt: `Generate a markdown-formatted response to the following question: ${question}, based on the provided content: ${content}`,
//             system: `You are a helpful assistant that provides informative responses in markdown format. Use proper markdown syntax.`,
//         });

//         console.log("AI Response -->", text);

//         return NextResponse.json(
//             {
//                 success: true,
//                 data: text,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error in AI response -->", error);
//         return handleError(error, "api");
//     }
// }

import handleError from "@/lib/handlers/errors";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { createGroq } from "@ai-sdk/groq"; // ← changed
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = AIAnswerSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { question, content } = validatedData.data;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"), // ← changed
      prompt: `Generate a concise markdown answer to the following question: ${question}, based on the provided content: ${content}. If code is needed, use fenced code blocks.`,
      system: `You are a helpful assistant. Reply in clean markdown only.
        Rules:
        - Use only backtick fenced code blocks (\`\`\`), never tilde fences (~~~)
        - Allowed code languages: js, ts, jsx, tsx, html, css, scss, json, bash, python, java, c, cpp, go, ruby, php
        - If language is unknown, open the block with just \`\`\` and no language tag  
        - Never use inline HTML, JSX, MDX components, or tables
        - Use paragraphs, headings, bold, italic, bullet lists, numbered lists, and code blocks only`,
    });

    // console.log("AI Response -->", text);
    
    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    console.error("Error in AI response -->", error);
      // ✅ Fix: handleError returns a plain object, wrap it in NextResponse.json()
    const result = handleError(error, "api") as { status: number; [key: string]: unknown };
    return NextResponse.json(result, { status: result.status ?? 500 });
    // return handleError(error, "api");
  }
}
