import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SentimentAnalysis() {
  const [sentence, setSentence] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      })
      const data = await response.json()
      setSentiment(data.sentiment)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sentiment Analysis</h1>
      <form onSubmit={analyzeSentiment} className="mb-4">
        <input
          type="text"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="Enter a sentence"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>
      {sentiment && (
        <div className="mt-4">
          <strong>Sentiment:</strong> {sentiment}
        </div>
      )}
    </div>
  )
}