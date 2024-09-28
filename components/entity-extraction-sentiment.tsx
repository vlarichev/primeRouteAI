"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import successFactorsConfig from '../success-factors.json'

// Add this type definition if not already present
type Sentiment = "strong positive" | "positive" | "negative" | "strong negative" | "not mentioned"

interface EntityAnalysis {
  entity: string
  sentiment: Sentiment
}

interface AnalysisResult {
  id: string
  text: string
  entities: EntityAnalysis[]
}

interface SentimentSummary {
  [key: string]: {
    positive: number;
    negative: number;
  }
}

const SentimentBadge = ({ sentiment }: { sentiment: Sentiment }) => {
  if (sentiment === "not mentioned") {
    return null;
  }

  const colors = {
    "strong positive": "bg-green-700 text-white",
    "positive": "bg-green-500 text-white",
    "negative": "bg-orange-500 text-white",
    "strong negative": "bg-red-600 text-white",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[sentiment]}`}>
      {sentiment}
    </span>
  )
}

// Remove the OpenAI initialization and analyzeEntities function

interface EntityExtractionSentimentProps {
  projectScore: number;
  updateScore: (change: number) => void;
  isLoading: boolean;
}

export function EntityExtractionSentiment({ projectScore, updateScore, isLoading }: EntityExtractionSentimentProps) {
  const [text, setText] = useState('')
  const [isEditing, setIsEditing] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [successFactors, setSuccessFactors] = useState<string[]>([])
  const [sentimentSummary, setSentimentSummary] = useState<SentimentSummary>({});

  useEffect(() => {
    setSuccessFactors(successFactorsConfig.successFactors);
    // Initialize sentiment summary
    const initialSummary = successFactorsConfig.successFactors.reduce((acc, factor) => {
      acc[factor] = { positive: 0, negative: 0 };
      return acc;
    }, {} as SentimentSummary);
    setSentimentSummary(initialSummary);
  }, []);

  const updateSentimentSummary = (entities: EntityAnalysis[], isAdding: boolean) => {
    setSentimentSummary(prevSummary => {
      const newSummary = { ...prevSummary };
      entities.forEach(entity => {
        if (newSummary[entity.entity]) {
          const change = isAdding ? 1 : -1;
          if (entity.sentiment.includes('positive')) {
            newSummary[entity.entity].positive += change;
          } else if (entity.sentiment.includes('negative')) {
            newSummary[entity.entity].negative += change;
          }
        }
      });
      return newSummary;
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const newResult = {
        id: Date.now().toString(),
        text,
        entities: data.entities
      };
      setResults(prevResults => [newResult, ...prevResults]);
      updateSentimentSummary(newResult.entities, true);
      setText('');

      // Update project score based on sentiment analysis
      const scoreChange = calculateScoreChange(newResult.entities);
      console.log(`EntityExtractionSentiment: Calculated score change: ${scoreChange}`);
      updateScore(scoreChange);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateScoreChange = (entities: EntityAnalysis[]): number => {
    let scoreChange = 0;
    entities.forEach(entity => {
      const change = Math.floor(Math.random() * 5) + 6; // Random number between 6-10
      switch (entity.sentiment) {
        case "strong positive":
          scoreChange += change;
          break;
        case "positive":
          scoreChange += Math.ceil(change / 2);
          break;
        case "negative":
          scoreChange -= Math.ceil(change / 2);
          break;
        case "strong negative":
          scoreChange -= change;
          break;
      }
    });
    return scoreChange;
  };

  const handleDelete = (id: string) => {
    const resultToDelete = results.find(result => result.id === id);
    if (resultToDelete) {
      updateSentimentSummary(resultToDelete.entities, false);
    }
    setResults(prevResults => prevResults.filter(result => result.id !== id));
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Success Factor Analysis</CardTitle>
          <CardDescription>Enter text to analyze for mentions of {successFactors.join(', ')} and their associated sentiments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(sentimentSummary).map(([factor, sentiment]) => (
              <Badge key={factor} variant="outline" className="flex items-center gap-1">
                {factor}
                <span className="text-green-500">+{sentiment.positive}</span>
                <span className="text-red-500">-{sentiment.negative}</span>
              </Badge>
            ))}
          </div>
          <Textarea
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || text.trim() === '' || isLoading}>
            {isAnalyzing ? 'Analyzing...' : isLoading ? 'AI is thinking...' : 'Analyze Text'}
          </Button>
        </CardFooter>
      </Card>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {results.map((result) => (
          <Card key={result.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Analysis Result
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(result.id)}
                aria-label="Delete analysis"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">{result.text}</p>
              <h3 className="text-sm font-semibold mb-2">Detected Success Factors and Sentiments:</h3>
              {result.entities.length > 0 ? (
                <ul className="space-y-2">
                  {result.entities.map((entity, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="capitalize">{entity.entity}</span>
                      <SentimentBadge sentiment={entity.sentiment} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm">No success factors ({successFactors.join(', ')}) were detected in the text.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  )
}