"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Sparkles, User, Copy, Loader2, Wand2 } from "lucide-react"
import { getChatResponse, improvePrompt, type AIModel } from "../lib/api"
import ReactMarkdown from "react-markdown"
import { Typewriter } from "@/components/typewriter"

type Message = {
  role: "ai" | "user"
  content: string
  isTyping?: boolean
}

export function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi, how can I help you today?",
      isTyping: false,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>("gemini-2.5-flash")
  const [isImproving, setIsImproving] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Call the API
      const response = await getChatResponse(inputValue, selectedModel)

      // Extract the response text from the object
      let responseText = "Sorry, I couldn't generate a response."

      if (response) {
        // Handle different response formats
        if (typeof response === "object") {
          // Try different possible response properties
          responseText = response.response || response.Response || response.content || response.message || JSON.stringify(response)
        } else if (typeof response === "string") {
          responseText = response
        }
      }

      // Add AI response with typing effect
      const aiMessage: Message = {
        role: "ai",
        content: responseText,
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      // After the typing animation is complete, mark it as finished
      setTimeout(
        () => {
          setMessages((prev) => prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, isTyping: false } : msg)))
        },
        responseText.length * 30 + 1000,
      ) // Approximate time for typing + buffer
    } catch (error) {
      console.error("Error getting response:", error)
      // Log more details for debugging
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      // Add error message
      const errorMessage: Message = {
        role: "ai",
        content: "Sorry, there was an error processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Improve the prompt
  const handleImprovePrompt = async () => {
    if (!inputValue.trim()) return

    setIsImproving(true)

    try {
      // Send just the prompt text, not an object
      const result = await improvePrompt(inputValue)

      if (result) {
        // Handle different response formats
        if (typeof result === "string") {
          setInputValue(result)
        } else if (typeof result === "object") {
          // Check for common properties that might contain the improved prompt
          if (result.improved) {
            setInputValue(result.improved)
          } else if (result.Response) {
            setInputValue(result.Response)
          } else if (result.response) {
            setInputValue(result.response)
          } else {
            // If we can't find a specific property, log the object
            console.warn("Unexpected improve prompt response format:", result)
            // Try to use the first string property we find
            for (const key in result) {
              if (typeof result[key] === "string") {
                setInputValue(result[key])
                break
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error improving prompt:", error)
      // Show a user-friendly error message
      alert("Failed to improve prompt. Please try again.")
    } finally {
      setIsImproving(false)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Copy message to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 bg-primary hover:bg-deepblue-700 shadow-lg z-50 transition-transform hover:scale-110 hidden md:flex"
        aria-label="Open chat"
      >
        <Bot size={28} className="text-white" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-[calc(4rem+1rem)] right-2 md:right-6 bg-white dark:bg-deepblue-900 p-3 md:p-6 rounded-xl border border-deepblue-700 w-[calc(100vw-1rem)] max-w-[520px] md:w-[520px] h-[calc(100vh-8rem)] max-h-[550px] md:h-[550px] shadow-xl z-50 flex flex-col backdrop-blur-sm text-black dark:text-deepblue-50"
        >
          {/* Header */}
          <div className="flex flex-col space-y-2 pb-4 border-b border-deepblue-700/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={24} className="text-primary" />
                <h2 className="font-bold text-xl tracking-tight text-primary">
                  Prompt Hub AI
                </h2>
              </div>
              <select
                title="Select AI model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                className="text-sm border rounded-md py-1 px-2 bg-white dark:bg-deepblue-800 border-deepblue-700 focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="deepseek-r1:70b">deepseek-r1:70b</option>
                <option value="llama3.2-vision">llama3.2-vision</option>
              </select>
            </div>
            <p className="text-sm text-deepblue-600 dark:text-deepblue-300">
              Ask me anything about prompts and the marketplace
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 ">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 my-4 text-sm ${message.role === "ai" ? "bg-deepblue-50 dark:bg-deepblue-800/40 p-3 rounded-lg" : "bg-deepblue-100/70 dark:bg-deepblue-700/40 p-3 rounded-lg"}`}
              >
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10">
                  <div
                    className={`rounded-full p-2 ${message.role === "ai" ? "bg-deepblue-100 dark:bg-deepblue-800" : "bg-deepblue-200 dark:bg-deepblue-700"}`}
                  >
                    {message.role === "ai" ? (
                      <Sparkles className="h-6 w-6 text-primary" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </span>
                <div className="leading-relaxed flex-1">
                  <span
                    className={`block font-bold mb-1 ${message.role === "ai" ? "text-deepblue-800 dark:text-deepblue-200" : "text-deepblue-900 dark:text-deepblue-100"}`}
                  >
                    {message.role === "ai" ? "AI" : "You"}
                  </span>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.role === "ai" && message.isTyping ? (
                      <Typewriter text={message.content} />
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
                {/* Copy button - only for user messages */}
                {message.role === "ai" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(message.content)}
                    className="text-primary hover:text-deepblue-700 hover:bg-deepblue-50 dark:hover:bg-deepblue-800"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 my-4 text-sm bg-deepblue-50 dark:bg-deepblue-800/40 p-3 rounded-lg animate-pulse">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10">
                  <div className="rounded-full bg-deepblue-100 dark:bg-deepblue-800 p-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </span>
                <div className="leading-relaxed flex-1">
                  <span className="block font-bold mb-1 text-deepblue-800 dark:text-deepblue-200">AI</span>
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                    <span className="text-primary">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-deepblue-700/60 mt-auto">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  className="flex-1 bg-white dark:bg-deepblue-800 border-deepblue-700 focus:ring-2 focus:ring-primary focus:border-primary rounded-md text-deepblue-900 dark:text-deepblue-50 placeholder:text-deepblue-400"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleImprovePrompt}
                  disabled={isLoading || isImproving || !inputValue.trim()}
                  title="Improve prompt"
                  className="bg-white dark:bg-deepblue-800 border-deepblue-700 hover:bg-deepblue-50 dark:hover:bg-deepblue-700/60"
                >
                  {isImproving ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Wand2 className="h-5 w-5 text-primary" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-full bg-primary hover:bg-deepblue-700 text-white py-2 rounded-md transition-all"
              >
                <Send className="h-5 w-5 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

