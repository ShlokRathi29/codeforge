import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  X,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Mail,
  Zap,
  Globe2,
} from 'lucide-react'
import { Button } from './Button'
import {
  getCounselorOutreachSuggestion,
  type LLMProviderChoice,
} from '../../api/client'

interface AICounselorSuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  streakDays?: number
  stressLevel?: number
  affectedDates?: string
  onMarkContacted?: () => void
}

export const AICounselorSuggestionModal: React.FC<AICounselorSuggestionModalProps> = ({
  isOpen,
  onClose,
  studentName,
  streakDays = 3,
  stressLevel = 5,
  affectedDates = 'Oct 12 – Oct 14',
  onMarkContacted,
}) => {
  const [provider, setProvider] = useState<LLMProviderChoice>('auto')
  const [suggestion, setSuggestion] = useState<string>('')
  const [model, setModel] = useState<string>('auto')
  const [providerName, setProviderName] = useState<string>('Multi-LLM')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchSuggestion = async (chosenProvider = provider) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await getCounselorOutreachSuggestion(
        studentName,
        streakDays,
        stressLevel,
        affectedDates,
        chosenProvider
      )
      setSuggestion(res.suggestion)
      if (res.model) setModel(res.model)
      if (res.provider) setProviderName(res.provider)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to generate outreach suggestion from AI engine.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchSuggestion(provider)
    } else {
      setSuggestion('')
      setCopied(false)
    }
  }, [isOpen, studentName, provider])

  if (!isOpen) return null

  const handleCopy = () => {
    if (!suggestion) return
    navigator.clipboard.writeText(suggestion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#BFEAFF] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFF4FF] bg-[#F8FCFF] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFD84D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                    AI Counselor Outreach Assistant
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]">
                    {providerName} • {model}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trauma-informed, FERPA & Rule 07 compliant draft for <strong>{studentName}</strong>
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

          {/* Provider Selector Bar */}
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
                <span>🇮🇳 Sarvam AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Signal Context Pill */}
          <div className="p-3 rounded-2xl bg-[#DFF4FF]/40 border border-[#BFEAFF] flex items-center justify-between text-xs">
            <span className="text-slate-700">
              Trigger: <strong>Stress ≥ {stressLevel}</strong> for <strong>{streakDays} consecutive days</strong> ({affectedDates})
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Action Recommended
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">
                Retrieving trauma-informed outreach guidelines and generating draft with Groq...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F8FCFF] border border-[#BFEAFF] text-xs text-[#111111] leading-relaxed whitespace-pre-line shadow-xs font-mono">
                {suggestion}
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Rule 07 Isolation:</strong> This suggestion was created from dates & stress scores only. Student private reflections are never accessed.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#DFF4FF] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => fetchSuggestion(provider)}
            disabled={isLoading}
            className="text-xs text-slate-600 hover:text-[#111111] flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Draft</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              disabled={isLoading || !suggestion}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Outreach Email'}
            </Button>

            {onMarkContacted && (
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  onMarkContacted()
                  onClose()
                }}
                leftIcon={<Mail className="w-3.5 h-3.5 text-[#111111]" />}
              >
                Mark as Contacted
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
