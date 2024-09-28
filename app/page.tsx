"use client"

import { useState, useCallback } from "react";
import { ProjectSuccessFactorsTable } from "@/components/project-success-factors-table";
import { EntityExtractionSentiment } from "@/components/entity-extraction-sentiment";
import { ProjectScore } from "@/components/project-score";
import { AIThinkingEffect } from "@/components/ai-thinking-effect";

export default function Home() {
  const [projectScore, setProjectScore] = useState(50);
  const [lastUpdateSource, setLastUpdateSource] = useState<'table' | 'sentiment' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScoreUpdate = useCallback((change: number, source: 'table' | 'sentiment') => {
    setIsLoading(true);
    console.log(`Updating score by ${change}. Current score: ${projectScore}. Source: ${source}`);
    
    // Simulate loading time
    setTimeout(() => {
      setProjectScore(prevScore => {
        const newScore = Math.max(1, Math.min(100, prevScore + change));
        console.log(`New score: ${newScore}`);
        return newScore;
      });
      setLastUpdateSource(source);
      setIsLoading(false);
    }, 3000); // 3 seconds delay for more noticeable effect
  }, [projectScore]);

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white text-black p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold relative">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="subtle-glow">
                  <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <span className="relative z-10 text-black [filter:url(#subtle-glow)_drop-shadow(0_0_0.5px_rgba(0,0,0,0.2))]">
              PrimeRoute
            </span>
          </h1>
        </div>
      </header>

      <main className="flex-grow p-8 sm:p-20 relative">
        {isLoading && <AIThinkingEffect />}
        <div className="mb-8">
          <ProjectScore initialScore={projectScore} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <ProjectSuccessFactorsTable 
              projectScore={projectScore} 
              updateScore={(change) => handleScoreUpdate(change, 'table')}
              lastUpdateSource={lastUpdateSource}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <EntityExtractionSentiment 
              projectScore={projectScore} 
              updateScore={(change) => handleScoreUpdate(change, 'sentiment')}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white p-4">
        <a>
          PrimeRoute
        </a>
      </footer>
    </div>
  );
}
