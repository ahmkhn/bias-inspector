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
        { role: "system", content: `
          "Analyze the following academic text for potential biases. Your task is to identify, classify, and provide actionable insights on biases in the text. The analysis should cover the following categories of biases:

Gender Bias: Examine the use of pronouns, gendered stereotypes, language suggesting unequal representation, or assumptions about roles or abilities based on gender.
Regional/Cultural Bias: Look for Western-centric views, exclusion of non-Western perspectives, or any statements that favor one culture, region, or ethnicity over others.
Colonial Perspectives: Identify language or assumptions rooted in colonial ideology, marginalization of indigenous perspectives, or framing that reflects colonial dominance.
Missing Viewpoints or Perspectives: Highlight gaps where underrepresented groups, marginalized perspectives, or diverse viewpoints are noticeably absent or ignored.
The output should be provided in JSON format and must include:

Highlighted Phrases: Specific excerpts or phrases from the text that exhibit the bias. Ensure a minimum of 3–5 examples per bias category, where applicable. If the text length is longer provide even more bias examples, be very detailed.
Type of Bias: Clearly classify the bias under one of the four categories (e.g., "Gender Bias," "Regional/Cultural Bias").
Suggested Improvements: Offer practical and detailed recommendations for rephrasing, restructuring, or supplementing the text to address and mitigate the identified bias.
Confidence Score: Assign a numeric score (0-1) indicating your confidence in the identified bias, with 1 being most confident and 0 being least confident.
Additionally, include:

A Final Summary: Provide a concise and thoughtful evaluation of the overall biases in the text. Discuss whether the text exhibits systemic patterns of bias or appears mostly neutral and balanced. Highlight any major areas for improvement.

Provide your response in JSON format, using the example below for guidance (this is not the text to analyze):
json
{
  "bias_analysis": [
    {
      "highlighted_phrase": "Women are naturally better at caregiving than men.",
      "type_of_bias": "Gender Bias",
      "suggested_improvement": "Rephrase to 'Caregiving roles are often associated with women due to societal expectations, but both men and women are equally capable of caregiving.'",
      "confidence_score": 0.9
    },
    {
      "highlighted_phrase": "This theory has been widely accepted in the West.",
      "type_of_bias": "Regional/Cultural Bias",
      "suggested_improvement": "Specify that this is a Western perspective and consider including other regional viewpoints for balance.",
      "confidence_score": 0.85
    },
    {
      "highlighted_phrase": "The natives were uncivilized and needed guidance.",
      "type_of_bias": "Colonial Perspectives",
      "suggested_improvement": "Avoid value-laden terms like 'uncivilized' and 'needed guidance'; instead, describe the historical interaction in neutral terms.",
      "confidence_score": 0.95
    },
    {
      "highlighted_phrase": "No discussion of LGBTQ+ perspectives.",
      "type_of_bias": "Missing Viewpoints or Perspectives",
      "suggested_improvement": "Include LGBTQ+ viewpoints to provide a more inclusive perspective.",
      "confidence_score": 0.8
    }
  ],
  "final_summary": "The text exhibits significant biases, particularly in its gendered language and colonial framing of indigenous peoples. While it provides a detailed analysis from a Western perspective, it fails to include diverse regional viewpoints or underrepresented perspectives, such as those from LGBTQ+ communities. Addressing these issues would significantly enhance the neutrality and inclusivity of the text.",
  "key_findings": [
    {
      "category": "Regional/Cultural Bias",
      "details": "Strong emphasis on Western perspectives, particularly US and EU viewpoints. Limited consideration of global privacy frameworks and cultural norms."
    },
    {
      "category": "Missing Perspectives",
      "details": "Limited representation of global and diverse community viewpoints. Lack of consideration for different socioeconomic backgrounds and cultural contexts."
    },
    {
      "category": "Colonial Perspectives",
      "details": "Implicit bias in comparing regional approaches to privacy, with a tendency to present Western approaches as more advanced or superior."
    }
  ]
}

Important Notes:

Thoroughness: Ensure that all categories of bias are evaluated, even if no specific examples are found (indicate "No bias detected" if applicable).
Clarity in Improvements: Provide actionable suggestions, ensuring they are specific, relevant, and easy to implement.
Be as precise and comprehensive as possible in your analysis."
"Process the entire text comprehensively and provide concise output."
          ` },
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
