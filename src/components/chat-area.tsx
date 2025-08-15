"use client";

import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Message } from "./chat-interface"

export function ChatArea({
  conversation,
  isTyping,
  customerName,
  onSendMessage,
  onImprovePrompt,
  onReaction,
  onSaveConversation,
  onCloseConversation,
  inputValue,
  setInputValue,
  selectedModel,
  setSelectedModel,
  onToggleDetails,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSendMessage(inputValue)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-deepblue-900 backdrop-blur-sm shadow-lg max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-deepblue-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{customerName}</h2>
            <p className="text-xs text-deepblue-300">Chat session active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSaveConversation}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleDetails}>
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={onCloseConversation}>
            Close
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                message.sender === "agent" ? "bg-deepblue-200" : "bg-deepblue-300"
              }`}
            >
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div
              className={`flex-1 rounded-lg p-3 text-sm ${
                message.sender === "agent"
                  ? "bg-deepblue-50 text-deepblue-800"
                  : "bg-deepblue-100 text-deepblue-900"
              }`}
            >
              <div className="flex justify-between">
                <div className="font-semibold">
                  {message.sender === "agent" ? "Agent" : customerName}
                </div>
                <div className="text-xs text-deepblue-400">{message.timestamp}</div>
              </div>
              <p className="mt-1 leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {message.reactions.likes} 👍
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {message.reactions.dislikes} 👎
                </Badge>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 text-sm text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            Agent is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-deepblue-700/60">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="bg-deepblue-800 border-deepblue-700 text-deepblue-50 placeholder:text-deepblue-300"
          />
          <Button type="submit" disabled={!inputValue.trim()}>
            <Send className="w-4 h-4 mr-1" /> Send
          </Button>
        </div>
      </form>
    </div>
  )
}

export type ChatAreaProps = {
  conversation: Message[]
  isTyping: boolean
  customerName: string
  onSendMessage: (content: string) => void
  onImprovePrompt: (content: string) => Promise<string>
  onReaction: (messageId: string, type: "like" | "dislike") => void
  onSaveConversation: () => void
  onCloseConversation: () => void
  inputValue: string
  setInputValue: (value: string) => void
  selectedModel: string
  setSelectedModel: (value: string) => void
  onToggleDetails: () => void
}
