"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatResponse, type AIModel, generateImage, improvePrompt, type ImageModel } from "@/lib/api"
import { Wand2, GitCompareArrows, Image as ImageIcon, Video, Star, Loader2 } from "lucide-react"

export default function ComparePanel() {
  const [prompt, setPrompt] = useState("")
  const [modelLeft, setModelLeft] = useState<AIModel>("gemini-2.5-flash")
  const [modelRight, setModelRight] = useState<AIModel>("gemini-2.5-pro")
  const [imageModelLeft, setImageModelLeft] = useState<ImageModel>("gemini-2.0-flash-preview-image-generation")
  const [imageModelRight, setImageModelRight] = useState<ImageModel>("gemini-2.0-flash-preview-image-generation")
  const [compareType, setCompareType] = useState<"text" | "image" | "video">("text")
  const [isLoading, setIsLoading] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [leftResult, setLeftResult] = useState<string>("")
  const [rightResult, setRightResult] = useState<string>("")

  const formatText = (input: any) => {
    if (!input) return ""
    if (typeof input === "string") return input
    return input.Response || input.response || input.content || JSON.stringify(input)
  }

  const runCompare = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setLeftResult("")
    setRightResult("")

    try {
      if (compareType === "text") {
        const [left, right] = await Promise.all([
          getChatResponse(prompt, modelLeft),
          getChatResponse(prompt, modelRight),
        ])
        setLeftResult(formatText(left))
        setRightResult(formatText(right))
      } else if (compareType === "image") {
        const [left, right] = await Promise.all([
          generateImage(prompt, imageModelLeft),
          generateImage(prompt, imageModelRight),
        ])
        setLeftResult(left || "")
        setRightResult(right || "")
      } else {
        // Video coming soon placeholder
        setLeftResult("Video comparison coming soon...")
        setRightResult("Video comparison coming soon...")
      }
    } catch (e) {
      setLeftResult("Failed to get response.")
      setRightResult("Failed to get response.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImprove = async () => {
    if (!prompt.trim()) return
    setIsImproving(true)
    try {
      const target = compareType === "image" ? "image" : "text"
      const improved = await improvePrompt(prompt, target)
      if (improved) setPrompt(improved)
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-r from-purple-400 to-blue-500 backdrop-blur-sm shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-purple-400" />
          <span className="font-semibold">Model Compare</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={compareType}
            onChange={(e) => setCompareType(e.target.value as any)}
            className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            title="Compare type"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video (coming soon)</option>
          </select>
          {compareType === "text" ? (
            <>
              <select
                value={modelLeft}
                onChange={(e) => setModelLeft(e.target.value as AIModel)}
                className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Left model"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
              </select>
              <select
                value={modelRight}
                onChange={(e) => setModelRight(e.target.value as AIModel)}
                className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Right model"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
              </select>
            </>
          ) : (
            <>
              <select
                value={imageModelLeft}
                onChange={(e) => setImageModelLeft(e.target.value as ImageModel)}
                className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Left image model"
              >
                <option value="gemini-2.0-flash-preview-image-generation">gemini-2.0-flash-preview-image-generation</option>
                <option value="gemini-2.0-flash-exp-image-generation">gemini-2.0-flash-exp-image-generation</option>
              </select>
              <select
                value={imageModelRight}
                onChange={(e) => setImageModelRight(e.target.value as ImageModel)}
                className="text-xs sm:text-sm border rounded-md py-1 px-2 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                title="Right image model"
              >
                <option value="gemini-2.0-flash-preview-image-generation">gemini-2.0-flash-preview-image-generation</option>
                <option value="gemini-2.0-flash-exp-image-generation">gemini-2.0-flash-exp-image-generation</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input
              className={`w-full pr-9 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isImproving ? "ring-2 ring-blue-500" : ""}`}
              placeholder={compareType === "text" ? "Enter a text prompt to compare models..." : "Describe the image to generate and compare..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isImproving || isLoading}
            />
            <button
              type="button"
              onClick={handleImprove}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-500"
              title="Improve prompt"
              disabled={isImproving || isLoading || !prompt.trim()}
            >
              {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            </button>
          </div>
          <Button onClick={runCompare} disabled={isLoading || !prompt.trim()} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : compareType === "text" ? (
              <Wand2 className="h-5 w-5" />
            ) : (
              <ImageIcon className="h-5 w-5" />
            )}
            <span className="ml-2">Compare</span>
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-auto">
        <div className="border-r border-gray-200 min-h-0 flex flex-col relative">
          <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
            {compareType === "text" ? modelLeft : imageModelLeft}
          </div>
          <div className="p-4 overflow-auto text-sm leading-6 space-y-4 bg-white/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-700"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Generating...</div>
            ) : compareType === "text" ? (
              <div className="whitespace-pre-wrap break-words text-gray-900">{leftResult}</div>
            ) : leftResult ? (
              <img src={leftResult} alt="Left generated" className="max-w-full h-auto rounded" />
            ) : (
              <div className="text-gray-700 text-center py-12">No results yet</div>
            )}
          </div>
        </div>
        <div className="min-h-0 flex flex-col relative">
          <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
            {compareType === "text" ? modelRight : imageModelRight}
          </div>
          <div className="p-4 overflow-auto text-sm leading-6 space-y-4 bg-white/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-700"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Generating...</div>
            ) : compareType === "text" ? (
              <div className="whitespace-pre-wrap break-words text-gray-900">{rightResult}</div>
            ) : rightResult ? (
              <img src={rightResult} alt="Right generated" className="max-w-full h-auto rounded" />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}