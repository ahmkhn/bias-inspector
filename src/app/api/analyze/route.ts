import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { ratelimit } from '~/server/ratelimit';
import { auth } from "@clerk/nextjs/server";
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
          <query>
            <system_instructions>
                Analyze the following academic text for potential biases. Your task is to identify, classify, 
                and provide actionable insights on biases in the text. The analysis MAY cover the following 
                categories of biases, pick the top biases seen in the text and report about them.

                1. Gender Bias: Examine the use of pronouns, gendered stereotypes, language suggesting 
                  unequal representation, or assumptions about roles or abilities based on gender.
                2. Regional/Cultural Bias: Look for Western-centric views, exclusion of non-Western perspectives, 
                  or any statements that favor one culture, region, or ethnicity over others.
                3. Colonial Perspectives: Identify language or assumptions rooted in colonial ideology, 
                  marginalization of indigenous perspectives, or framing that reflects colonial dominance.
                4. Missing Viewpoints or Perspectives: Highlight gaps where underrepresented groups, 
                  marginalized perspectives, or diverse viewpoints are noticeably absent or ignored.
                5. Adherence Bias
                6. Admission rate bias
                7. Design bias
                8. Sample bias
                9. Selection bias
                10. Performance bias
                11. Detection bias
                12. Case Selection Bias (important)
                ...and many more. Be detailed and specific in your key findings report.

                Analyze this list one by one, and provide a detailed report on the biases you did NOT see 
                in the text, and provide positive and critical feedback. However, the biases you did not see 
                should be relevant to the context of the research and text.

                For example, if the text or research has NOTHING about gender, then obviously gender bias 
                will not be present, and you should not report on it, and instead other biases should be 
                present in the key_findings_not_seen.

                The output should be provided in JSON format and must include:

                Highlighted Phrases: Specific excerpts or phrases from the text that exhibit the bias. 
                Ensure a minimum of 3–5 examples per bias category, where applicable. If the text length 
                is longer, provide even more bias examples; be very detailed.

                Type of Bias: Clearly classify the bias under one of the four categories 
                (e.g., "Gender Bias," "Regional/Cultural Bias").

                Suggested Improvements: Offer practical and detailed recommendations for rephrasing, 
                restructuring, or supplementing the text to address and mitigate the identified bias.

                Confidence Score: Assign a numeric score (0-1) indicating your confidence in the identified bias, 
                with 1 being most confident and 0 being least confident.

                Additionally, include:

                A Final Summary: Provide a concise and thoughtful evaluation of the overall biases in the text. 
                Discuss whether the text exhibits systemic patterns of bias or appears mostly neutral and balanced. 
                Highlight any major areas for improvement.

                Provide your response in this JSON format—must exactly match this structure:

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
                  "positive_feedback": "The text does well in these areas... and is significantly better than other texts in this category.....",
                  "negative_feedback": "The text exhibits significant biases, particularly in its gendered language and colonial framing of indigenous peoples. While it provides a detailed analysis from a Western perspective, it fails to include diverse regional viewpoints or underrepresented perspectives, such as those from LGBTQ+ communities. Addressing these issues would significantly enhance the neutrality and inclusivity of the text.",
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
                  ],
                  "key_findings_not_seen": [
                    {
                      "category": "Regional/Cultural Bias",
                      "details": "The text did well in avoiding bias in this category by..."
                    }
                  ]
                }

                Important Notes:
                1. Thoroughness: Ensure that all categories of bias are evaluated, even if no specific 
                  examples are found (indicate "No bias detected" if applicable).
                2. Clarity in Improvements: Provide actionable suggestions, ensuring they are specific, 
                  relevant, and easy to implement.
                3. Be as precise and comprehensive as possible in your analysis.

                Process the entire text comprehensively and provide concise output.
            </system_instructions>
            <user_input>
                <!-- We'll pass in the actual text for analysis via the user message -->
                textData
            </user_input>
        </query>
      ` },
        { 
          role: "user", 
          content: textData
        },
      ],
    });

    const message = completion.choices?.[0]?.message;
    if (!message) {
      throw new Error('No message returned from OpenAI');
    }


    const user = await auth();
    const { success } = await ratelimit.limit(user.userId ?? '');
    if (!success) {
      return NextResponse.json({ error: 'Ratelimited' }, { status: 429 });
    }
    return NextResponse.json({ result: message });

    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
