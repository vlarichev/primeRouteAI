"use client"

import { useState, useEffect } from "react"

interface ProjectScoreProps {
  initialScore: number
}

export function ProjectScore({ initialScore }: ProjectScoreProps) {
  const [projectScore, setProjectScore] = useState(initialScore)
  const [animatedScore, setAnimatedScore] = useState(initialScore)

  useEffect(() => {
    setProjectScore(initialScore)
  }, [initialScore])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(projectScore)
    }, 300) // 300ms delay before starting the animation

    return () => clearTimeout(timer)
  }, [projectScore])

  // Remove the unused updateScore function
  // const updateScore = (change: number) => {
  //   setProjectScore(prevScore => Math.max(1, Math.min(100, prevScore + change)))
  // }

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getColor = (score: number) => {
    if (score < 40) return 'text-red-500'
    if (score < 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  const colorClass = getColor(projectScore)

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">Project Score</h2>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-in-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{projectScore}</span>
        </div>
      </div>
    </div>
  )
}

export function useProjectScore(initialScore: number) {
  const [projectScore, setProjectScore] = useState(initialScore)

  const updateScore = (change: number) => {
    setProjectScore(prevScore => Math.max(1, Math.min(100, prevScore + change)))
  }

  return { projectScore, updateScore }
}