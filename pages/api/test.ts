import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";

type Data = {
  sentiment: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sentiment: '', error: 'Method Not Allowed' })
  }

  const { sentence } = req.body

  if (!sentence) {
    return res.status(400).json({ sentiment: '', error: 'Sentence is required' })
  }

  try {
    const llm = new OpenAI({ temperature: 0 })
    const prompt = PromptTemplate.fromTemplate(
      "Analyze the sentiment of the following sentence. Respond with only 'positive' or 'negative': {sentence}"
    )
    const chain = new RunnableSequence({ llm, prompt })
    const result = await chain.call({ sentence })
    
    res.status(200).json({ sentiment: result.text.trim().toLowerCase() })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ sentiment: '', error: 'Internal Server Error' })
  }
}