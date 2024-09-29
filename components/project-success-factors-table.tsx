"use client"

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
// import ProjectScore from './project-score';

interface ProjectSuccessFactorsTableProps {
  updateScore: (change: number) => void;
  isLoading: boolean;
}

const ProjectSuccessFactorsTable: React.FC<ProjectSuccessFactorsTableProps> = ({ updateScore, isLoading }) => {
  const initialProjectFactors = [
    { category: "Project Planning and Management", factor: "Percentage of Requirements Completed", weight: "15%", currentState: "55", valueType: "%" },
    { category: "Project Planning and Management", factor: "Number of Change Requests Received", weight: "10%", currentState: "8", valueType: "Requests" },
    { category: "Project Planning and Management", factor: "Milestones Achieved on Time", weight: "10%", currentState: "75", valueType: "%" },
    { category: "Project Planning and Management", factor: "Average Task Completion Time", weight: "15%", currentState: "4", valueType: "Days" },
    { category: "Project Planning and Management", factor: "Number of Identified Risks", weight: "10%", currentState: "12", valueType: "Count" },
    { category: "Project Planning and Management", factor: "Number of Team Meetings Held", weight: "5%", currentState: "10", valueType: "Count" },
    { category: "Stakeholder Engagement and Communication", factor: "Number of Stakeholder Meetings Held", weight: "10%", currentState: "6", valueType: "Count" },
    { category: "Stakeholder Engagement and Communication", factor: "Stakeholder Feedback Score", weight: "5%", currentState: "82", valueType: "%" },
    { category: "Project Objectives and Scope Management", factor: "Percentage of Objectives Met", weight: "10%", currentState: "90", valueType: "%" },
    { category: "Project Objectives and Scope Management", factor: "Number of Scope Changes Approved", weight: "5%", currentState: "2", valueType: "Requests" },
    { category: "Resource and Expertise Management", factor: "Percentage of Resources Utilized", weight: "5%", currentState: "70", valueType: "%" },
    { category: "Resource and Expertise Management", factor: "Number of Training Sessions Conducted", weight: "5%", currentState: "3", valueType: "Count" },
    { category: "External Factors and Risk Management", factor: "Number of Market Research Reports Completed", weight: "5%", currentState: "1", valueType: "Count" },
    { category: "External Factors and Risk Management", factor: "Contingency Budget Utilization Rate", weight: "5%", currentState: "20", valueType: "%" },
    { category: "Quality Assurance and Control", factor: "Number of Quality Reviews Conducted", weight: "5%", currentState: "4", valueType: "Count" },
    { category: "Quality Assurance and Control", factor: "Percentage of Defect Resolution", weight: "5%", currentState: "85", valueType: "%" },
    { category: "Budget Management", factor: "Percentage of Budget Spent", weight: "5%", currentState: "60", valueType: "%" },
    { category: "Budget Management", factor: "Number of Budget Variance Reports", weight: "5%", currentState: "3", valueType: "Count" },
    { category: "Time Management", factor: "Percentage of Tasks Completed on Schedule", weight: "5%", currentState: "78", valueType: "%" },
    { category: "Time Management", factor: "Average Delay per Task", weight: "5%", currentState: "2", valueType: "Days" },
    { category: "Team Performance and Dynamics", factor: "Team Satisfaction Score", weight: "5%", currentState: "75", valueType: "%" },
  ]

  const [projectFactors, setProjectFactors] = React.useState(initialProjectFactors)
  const [lastCalculatedScore, setLastCalculatedScore] = React.useState(0)

  const calculateWeightedSum = React.useCallback(() => {
    return projectFactors.reduce((sum, factor) => {
      const weight = parseFloat(factor.weight) / 100
      const value = parseFloat(factor.currentState) || 0
      return sum + weight * value
    }, 0)
  }, [projectFactors])

  const regenerateRandomNumbers = React.useCallback(() => {
    setProjectFactors(prevFactors =>
      prevFactors.map(factor => ({
        ...factor,
        currentState: Math.floor(Math.random() * 80) + 1 + '' // 80 is the maximum value
      }))
    )
  }, [])

  const handleCurrentStateChange = React.useCallback((index: number, value: string) => {
    setProjectFactors(prevFactors =>
      prevFactors.map((factor, i) =>
        i === index ? { ...factor, currentState: value } : factor
      )
    )
  }, [])

  React.useEffect(() => {
    const newWeightedSum = calculateWeightedSum()
    const newScore = Math.round(Math.max(1, Math.min(90, newWeightedSum)))
    
    if (newScore !== lastCalculatedScore) {
      console.log(`ProjectSuccessFactorsTable: Updating score from ${lastCalculatedScore} to ${newScore}`);
      updateScore(newScore - lastCalculatedScore) // Use updateScore instead of onFactorChange
      setLastCalculatedScore(newScore)
    }
  }, [projectFactors, updateScore, calculateWeightedSum, lastCalculatedScore])

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        Here are current hard facts, scanned from your project...
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={regenerateRandomNumbers}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'AI is thinking...' : 'Reload your project'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table className="border-collapse border border-slate-400">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-slate-300 bg-slate-50 font-bold">Category of a Factor</TableHead>
              <TableHead className="border border-slate-300 bg-slate-50 font-bold">Factor</TableHead>
              <TableHead className="border border-slate-300 bg-slate-50 font-bold">Weight-Impact on Project Score</TableHead>
              <TableHead className="border border-slate-300 bg-primary font-bold text-primary-foreground">Current State</TableHead>
              <TableHead className="border border-slate-300 bg-slate-50 font-bold">Value Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectFactors.map((factor, index) => (
              <TableRow key={index}>
                <TableCell className="border border-slate-300">{factor.category}</TableCell>
                <TableCell className="border border-slate-300">{factor.factor}</TableCell>
                <TableCell className="border border-slate-300 text-center">{factor.weight}</TableCell>
                <TableCell className="border border-slate-300 text-center bg-primary/10 font-medium p-0">
                  <Input
                    type="number"
                    value={factor.currentState}
                    onChange={(e) => handleCurrentStateChange(index, e.target.value)}
                    className="w-full h-full text-center bg-transparent border-none focus:ring-0"
                    min="0"
                    max="100"
                    disabled={false}
                  />
                </TableCell>
                <TableCell className="border border-slate-300 text-center">{factor.valueType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProjectSuccessFactorsTable;