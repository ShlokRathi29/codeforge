import React, { useState } from 'react'
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Zap,
  Globe2,
} from 'lucide-react'
import { Button } from './Button'
import { Mascot, mascotLogo } from './Mascot'
import {
  askStudentRAG,
  type RAGQueryResponse,
  type LLMProviderChoice,
} from '../../api/client'

interface AIStudentCompanionModalProps {
  isOpen: boolean
  onClose: () => void
  studentName?: string
  recentContext?: any
}

const QUICK_PROMPTS = [
  '😴 How can I sleep better before an exam?',
  '🇮🇳 Mujhe exam ki bohot tension ho rahi hai',
  '📚 Overwhelmed by deadlines and finals',
  '🇮🇳 Raat ko neend nahi aati, kya karun?',
  '👥 Feeling isolated and lonely on campus',
  '🧘 Quick 2-minute stress reduction technique',
]

export const AIStudentCompanionModal: React.FC<AIStudentCompanionModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Student',
  recentContext,
}) => {
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState<LLMProviderChoice>('auto')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<
    Array<{
      question: string
      response: RAGQueryResponse
    }>
  >([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await askStudentRAG(questionText, studentName, recentContext, provider)
      setHistory((prev) => [...prev, { question: questionText, response: res }])
      setQuery('')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Could not connect to AI RAG engine. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#BFEAFF] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFF4FF] bg-[#F8FCFF] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD84D] border border-[#FFC928] flex items-center justify-center text-[#111111]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                    WellTrack AI Companion
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]">
                    Multi-LLM RAG
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Grounded in verified campus health & academic guidelines
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#DFF4FF] text-slate-500 hover:text-[#111111] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Model Provider Selector Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-[#DFF4FF]/70">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span>Engine:</span>
            </span>
            <div className="inline-flex rounded-xl bg-white border border-[#BFEAFF] p-0.5 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setProvider('auto')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  provider === 'auto'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Router</span>
              </button>
              <button
                type="button"
                onClick={() => setProvider('groq')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  provider === 'groq'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111]'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-700" />
                <span>⚡ Groq Cloud</span>
              </button>
              <button
                type="button"
                onClick={() => setProvider('sarvam')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  provider === 'sarvam'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111]'
                }`}
              >
                <Globe2 className="w-3 h-3 text-indigo-700" />
                <span>🇮🇳 Sarvam AI (Indic)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Chat History Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {history.length === 0 ? (
            <div className="py-4 text-center space-y-3">
              <div className="h-28 w-28 mx-auto">
                <Mascot mode="thinking" className="h-full w-full" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#111111]">
                  Hi {studentName}! How can I support you today?
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ask in English or Hinglish / Hindi about sleep, exams, loneliness, or campus protocols.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="pt-2 text-left space-y-1.5 max-w-md mx-auto">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Suggested Questions:
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAsk(prompt)}
                      className="p-2.5 rounded-xl bg-[#F8FCFF] hover:bg-[#DFF4FF]/50 border border-[#BFEAFF] text-left text-xs text-[#111111] transition cursor-pointer flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <span className="text-slate-400 group-hover:text-[#111111] transition">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Student Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] p-3.5 rounded-2xl bg-[#FFD84D] text-[#111111] text-xs font-semibold shadow-xs">
                      {item.question}
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#1684d6] shrink-0 shadow-2xs">
                      <img src={mascotLogo} alt="Pingu" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      {/* Provider info pill */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF] flex items-center gap-1">
                          <span>{item.response.provider}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{item.response.model}</span>
                        </span>
                        {item.response.latency_ms ? (
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.response.latency_ms}ms
                          </span>
                        ) : null}
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8FCFF] border border-[#BFEAFF] text-xs text-[#111111] leading-relaxed whitespace-pre-line shadow-xs">
                        {item.response.answer}
                      </div>

                      {/* Cited RAG Knowledge References */}
                      {item.response.references && item.response.references.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#111111]" />
                            <span>Retrieved Campus Guidelines:</span>
                          </span>
                          {item.response.references.map((ref, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#BFEAFF] text-slate-700"
                            >
                              {ref.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8FCFF] border border-[#BFEAFF]">
              <div className="w-6 h-6 border-2 border-[#FFD84D] border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="text-xs text-slate-600">
                <span>Retrieving campus wellness guidelines and consulting Multi-LLM engine...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#DFF4FF] bg-white space-y-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk(query)
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about sleep, academic pressure, or campus wellness..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs bg-[#F8FCFF] border border-[#BFEAFF] rounded-xl text-[#111111] placeholder-slate-400 focus:outline-none focus:border-[#FFD84D] focus:ring-2 focus:ring-[#FFD84D]/30 transition"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!query.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<Send className="w-3.5 h-3.5 text-[#111111]" />}
            >
              Ask
            </Button>
          </form>

          {/* Non-clinical & Crisis Notice */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Non-clinical RAG assistant. Never replaces licensed care.</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <PhoneCall className="w-3 h-3" />
              <span>In crisis: Call/Text 988</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
