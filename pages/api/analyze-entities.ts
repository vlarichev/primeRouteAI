import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import axios from 'axios'
import successFactorsConfig from '../../success-factors.json'

// Check if the API key is available
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
})

type EntityAnalysis = {
  entity: string
  sentiment: "strong positive" | "positive" | "negative" | "strong negative" | "not mentioned"
}

type Data = {
  entities: EntityAnalysis[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ entities: [], error: 'Method Not Allowed' })
  }

  const { text } = req.body

  if (!text) {
    return res.status(400).json({ entities: [], error: 'Text is required' })
  }

  try {
    const factorList = successFactorsConfig.successFactors.join(', ')
    const prompt = `Analyze the following text for mentions of these success factors: ${factorList} and their associated sentiments. Respond in JSON format with an array of objects, each containing "entity" and "sentiment" keys. Possible sentiment values are "strong positive", "positive", "negative", "strong negative", or dont return it, if the factor isn't present.

Text: "${text}"

Example response:
[
  {"entity": "${successFactorsConfig.successFactors[0]}", "sentiment": "positive"},
  {"entity": "${successFactorsConfig.successFactors[2]}", "sentiment": "strong positive"}
]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        const entities = JSON.parse(content) as EntityAnalysis[];
        res.status(200).json({ entities });
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        res.status(500).json({ entities: [], error: 'Invalid response format from OpenAI' });
      }
    } else {
      res.status(500).json({ entities: [], error: 'No content in OpenAI response' });
    }
  } catch (error) {
    console.error('Error analyzing entities:', error);
    if (error instanceof OpenAI.APIError) {
      res.status(error.status || 500).json({ entities: [], error: error.message });
    } else if (axios.isAxiosError(error)) {
      // Handle Axios error
      res.status(error.response.status || 500).json({ 
        entities: [], 
        error: `Network error: ${error.message}`
      });
    } else {
      res.status(500).json({ entities: [], error: 'Internal Server Error' });
    }
  }
}