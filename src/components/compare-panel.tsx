"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatResponse, type AIModel } from "@/lib/api"
import { Wand2, GitCompareArrows, Image as ImageIcon, Video } from "lucide-react"

export default function ComparePanel() {
  const [prompt, setPrompt] = useState("")
  const [modelLeft, setModelLeft] = useState<AIModel>("deepseek-r1:70b")
  const [modelRight, setModelRight] = useState<AIModel>("gemini-2.5-flash")
  const [compareType, setCompareType] = useState<"text" | "image" | "video">("text")
  const [isLoading, setIsLoading] = useState(false)
  const [leftResult, setLeftResult] = useState<string>("")
  const [rightResult, setRightResult] = useState<string>("")

  const runCompare = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setLeftResult("")
    setRightResult("")

    try {
      if (compareType !== "text") {
        setLeftResult(`${compareType.toUpperCase()} comparison coming soon...`)
        setRightResult(`${compareType.toUpperCase()} comparison coming soon...`)
        return
      }

      const [left, right] = await Promise.all([
        getChatResponse(prompt, modelLeft),
        getChatResponse(prompt, modelRight),
      ])

      const getText = (r: any) =>
        typeof r === "string"
          ? r
          : r?.Response || r?.response || r?.content || JSON.stringify(r)

      setLeftResult(getText(left))
      setRightResult(getText(right))
    } catch (e) {
      setLeftResult("Failed to get response.")
      setRightResult("Failed to get response.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-gray-900/60">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-purple-400" />
          <span className="font-semibold">Model Compare</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={compareType}
            onChange={(e) => setCompareType(e.target.value as any)}
            className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-gray-900/60 border-gray-800 text-foreground focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            title="Compare type"
          >
            <option value="text">Text</option>
            <option value="image">Image (coming soon)</option>
            <option value="video">Video (coming soon)</option>
          </select>
          <select
            value={modelLeft}
            onChange={(e) => setModelLeft(e.target.value as AIModel)}
            className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-gray-900/60 border-gray-800 text-foreground focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            title="Left model"
          >
            <option value="deepseek-r1:70b">deepseek-r1:70b</option>
            <option value="llama3.2-vision">llama3.2-vision</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          </select>
          <select
            value={modelRight}
            onChange={(e) => setModelRight(e.target.value as AIModel)}
            className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-gray-900/60 border-gray-800 text-foreground focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            title="Right model"
          >
            <option value="deepseek-r1:70b">deepseek-r1:70b</option>
            <option value="llama3.2-vision">llama3.2-vision</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          </select>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-b border-gray-800 bg-gray-900/30">
        <div className="flex gap-2">
          <Input
            className="flex-1 border-gray-800 bg-gray-950 text-foreground placeholder:text-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            placeholder="Enter a prompt to compare models..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={runCompare} disabled={isLoading || !prompt.trim()} className="bg-primary hover:bg-primary/90">
            {compareType === "text" ? (
              <Wand2 className="h-5 w-5" />
            ) : compareType === "image" ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
            <span className="ml-2">Compare</span>
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="border-r border-gray-800 min-h-0 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-400">
            {modelLeft}
          </div>
          <div className="p-4 overflow-auto text-sm leading-6">
            {isLoading ? (
              <div className="text-gray-400">Generating...</div>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-foreground">{leftResult}</pre>
            )}
          </div>
        </div>
        <div className="min-h-0 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-400">
            {modelRight}
          </div>
          <div className="p-4 overflow-auto text-sm leading-6">
            {isLoading ? (
              <div className="text-gray-400">Generating...</div>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-foreground">{rightResult}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}