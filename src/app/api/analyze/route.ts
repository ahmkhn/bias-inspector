import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req : Request) {
  try {
    const { textData } = await req.json(); // Parse the textData from the request body

    if (!textData) {
      return NextResponse.json({ error: 'No textData provided' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.GPTKEY, // Access environment variable server-side
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return me a summary of this data, start with 'i am chatgpt har har har'" },
        { role: "user", content: textData }, // Use textData in the OpenAI query
      ],
    });

    const message = completion.choices?.[0]?.message;
    if (!message) {
      throw new Error('No message returned from OpenAI');
    }
    return NextResponse.json({ result: message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
