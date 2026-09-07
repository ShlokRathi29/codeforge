import React, { useState } from 'react'
import { Send, Bot, User, Sparkles, Copy, Check, Sliders, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export const PlaygroundView: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello! I am your AI assistant engine. Enter your prompt or test case below to simulate automated analysis, processing, or code generation.",
      timestamp: 'Just now',
    },
  ])

  const handleSend = () => {
    if (!prompt.trim()) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    const currentPrompt = prompt
    setPrompt('')
    setIsLoading(true)

    // Simulate intelligent LLM processing with instant turnaround for hackathon demo
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Analysis complete for: "${currentPrompt}"\n\n• Status: Optimal execution\n• Confidence score: 98.2%\n• Recommendation: Pipeline triggered successfully. Connect to backend endpoint to execute live inference.`,
        timestamp: 'Just now',
      }
      setMessages((prev) => [...prev, botMsg])
      setIsLoading(false)
    }, 900)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8.5rem)]">
      {/* Main Conversation / Playground area */}
      <div className="lg:col-span-3 flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Execution Session</h3>
              <p className="text-[11px] text-slate-400">Gemini 1.5 / Custom Model Pipeline</p>
            </div>
          </div>
          <Badge variant="success">Online</Badge>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-indigo-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-sm relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:opacity-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl p-3 bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400">Analyzing input data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question or provide test input data..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <Button
              type="submit"
              size="md"
              disabled={!prompt.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Run
            </Button>
          </form>
        </div>
      </div>

      {/* Side Settings / Model Parameters */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <CardTitle>Inference Controls</CardTitle>
            </div>
          </CardHeader>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Creativity (Temperature)</span>
                <span className="font-mono text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5">Model Engine</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500">
                <option>Custom Python Backend (FastAPI)</option>
                <option>Gemini 1.5 Pro</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Latency</span>
                <span className="text-emerald-400 font-mono font-semibold">42 ms</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Context tokens</span>
                <span className="text-slate-200 font-mono">1,024 / 8,192</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-indigo-950/20 border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Hackathon Tip</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            During judging demos, prepare 2-3 sample inputs ready to paste so you never encounter blank page syndrome.
          </p>
        </Card>
      </div>
    </div>
  )
}
