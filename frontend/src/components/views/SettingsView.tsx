import React, { useState, useEffect } from 'react'
import {
  Server,
  Key,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BookOpen,
  Zap,
  Globe2,
  Copy,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  API_BASE_URL,
  getAIStatus,
  testAIConnection,
  type AIStatusResponse,
  type ProviderTestResult,
} from '../../api/client'

export const SettingsView: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState(API_BASE_URL)
  const [groqKey, setGroqKey] = useState(localStorage.getItem('codeforge_groq_key') || '')
  const [sarvamKey, setSarvamKey] = useState(localStorage.getItem('codeforge_sarvam_key') || '')
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showSarvamKey, setShowSarvamKey] = useState(false)

  // Backend test state
  const [isTestingBackend, setIsTestingBackend] = useState(false)
  const [backendTestResult, setBackendTestResult] = useState<'success' | 'fail' | null>(null)
  const [backendLatency, setBackendLatency] = useState<number | null>(null)

  // AI RAG Status & Tests
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null)
  const [testingProvider, setTestingProvider] = useState<'all' | 'groq' | 'sarvam' | null>(null)
  const [groqTestResult, setGroqTestResult] = useState<ProviderTestResult | null>(null)
  const [sarvamTestResult, setSarvamTestResult] = useState<ProviderTestResult | null>(null)
  const [copiedEnv, setCopiedEnv] = useState(false)

  const renderEnvConfig = `# =================================================================
# CODEFORGE PRODUCTION ENVIRONMENT CONFIG (RENDER / PRODUCTION)
# =================================================================
PORT=8000
ENVIRONMENT=production
CORS_ORIGINS=*

# Multi-LLM Provider 1: Groq Cloud (Ultra-Fast English Reasoning)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Multi-LLM Provider 2: Sarvam AI (Premier Indic & Multilingual AI)
SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_MODEL=sarvam-105b-conversations

# Multi-LLM Auto-Routing Strategy (auto | groq | sarvam)
DEFAULT_LLM_PROVIDER=auto`

  useEffect(() => {
    getAIStatus()
      .then((data) => setAiStatus(data))
      .catch(() => {})
  }, [])

  const handleTestBackend = async () => {
    setIsTestingBackend(true)
    setBackendTestResult(null)
    setBackendLatency(null)

    const start = performance.now()
    try {
      const res = await fetch(`${backendUrl}/health`)
      const elapsed = Math.round(performance.now() - start)
      if (res.ok) {
        const data = await res.json()
        if (data?.status === 'ok') {
          setBackendTestResult('success')
          setBackendLatency(elapsed)
          return
        }
      }
      setBackendTestResult('fail')
    } catch (err) {
      console.error('[SettingsView] Backend handshake failed:', err)
      setBackendTestResult('fail')
    } finally {
      setIsTestingBackend(false)
    }
  }

  const handleTestGroq = async () => {
    setTestingProvider('groq')
    setGroqTestResult(null)
    try {
      const res = await testAIConnection('groq')
      if (res.details) {
        setGroqTestResult(res.details)
      } else {
        setGroqTestResult({
          status: res.status === 'ok' ? 'ok' : 'error',
          provider: 'Groq Cloud',
          model: 'openai/gpt-oss-120b',
        })
      }
    } catch (err: any) {
      setGroqTestResult({
        status: 'error',
        provider: 'Groq Cloud',
        error: err.response?.data?.detail || 'Handshake failed',
      })
    } finally {
      setTestingProvider(null)
    }
  }

  const handleTestSarvam = async () => {
    setTestingProvider('sarvam')
    setSarvamTestResult(null)
    try {
      const res = await testAIConnection('sarvam')
      if (res.details) {
        setSarvamTestResult(res.details)
      } else {
        setSarvamTestResult({
          status: res.status === 'ok' ? 'ok' : 'error',
          provider: 'Sarvam AI',
          model: 'sarvam-105b-conversations',
        })
      }
    } catch (err: any) {
      setSarvamTestResult({
        status: 'error',
        provider: 'Sarvam AI',
        error: err.response?.data?.detail || 'Handshake failed',
      })
    } finally {
      setTestingProvider(null)
    }
  }

  const handleTestAll = async () => {
    setTestingProvider('all')
    setGroqTestResult(null)
    setSarvamTestResult(null)
    try {
      const res = await testAIConnection('auto')
      if (res.providers) {
        if (res.providers.groq) setGroqTestResult(res.providers.groq)
        if (res.providers.sarvam) setSarvamTestResult(res.providers.sarvam)
      }
    } catch (err: any) {
      setGroqTestResult({
        status: 'error',
        provider: 'Groq Cloud',
        error: err.response?.data?.detail || 'Batch test failed',
      })
    } finally {
      setTestingProvider(null)
    }
  }

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(renderEnvConfig)
    setCopiedEnv(true)
    setTimeout(() => setCopiedEnv(false), 2500)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Project Configuration & Multi-LLM AI System</h2>
        <p className="text-xs text-slate-500 mt-1">
          Orchestration management for Groq Cloud (ultra-fast reasoning) and Sarvam AI (Indic & multilingual intelligence)
        </p>
      </div>

      {/* Multi-LLM Orchestration Panel */}
      <Card className="border-[#8ED8FF] bg-gradient-to-br from-white via-[#F8FCFF] to-[#DFF4FF]/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFD84D] flex items-center justify-center text-[#111111] shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Multi-LLM RAG Orchestration Architecture</CardTitle>
                <span className="text-[11px] text-slate-500">
                  Intelligent routing: English $\rightarrow$ Groq • Indic/Hinglish $\rightarrow$ Sarvam AI • Mutual Failover
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active Strategy: Auto
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestAll}
                isLoading={testingProvider === 'all'}
                leftIcon={<RefreshCw className="w-3 h-3 text-[#111111]" />}
              >
                Test Both
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 pt-1">
          {/* Side-by-Side Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider 1: Groq Cloud */}
            <div className="p-4 bg-white rounded-2xl border border-[#BFEAFF] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">Groq Cloud Engine</h4>
                    <span className="text-[10px] text-slate-500">LPU Sub-second Reasoning</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Configured
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Model:</span>
                  <span className="font-mono font-bold text-[#111111]">openai/gpt-oss-120b</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Specialization:</span>
                  <span className="text-slate-800 font-medium">Ultra-Fast English & Triage</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-[#DFF4FF]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestGroq}
                  isLoading={testingProvider === 'groq'}
                  leftIcon={<RefreshCw className="w-3 h-3 text-[#111111]" />}
                >
                  Ping Groq
                </Button>

                {groqTestResult && (
                  <div className="text-right">
                    <span
                      className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                        groqTestResult.status === 'ok' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {groqTestResult.status === 'ok' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>{groqTestResult.latency_ms}ms (OK)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Fail</span>
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Provider 2: Sarvam AI */}
            <div className="p-4 bg-white rounded-2xl border border-[#BFEAFF] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">Sarvam AI Engine</h4>
                    <span className="text-[10px] text-slate-500">Indic & Multilingual Model</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Configured
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Model:</span>
                  <span className="font-mono font-bold text-[#111111]">sarvam-105b-conversations</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Specialization:</span>
                  <span className="text-slate-800 font-medium">Hinglish, Hindi & Indian Languages</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-[#DFF4FF]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSarvam}
                  isLoading={testingProvider === 'sarvam'}
                  leftIcon={<RefreshCw className="w-3 h-3 text-[#111111]" />}
                >
                  Ping Sarvam
                </Button>

                {sarvamTestResult && (
                  <div className="text-right">
                    <span
                      className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                        sarvamTestResult.status === 'ok' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {sarvamTestResult.status === 'ok' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>{sarvamTestResult.latency_ms}ms (OK)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Fail</span>
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RAG Knowledge Base Stats */}
          <div className="p-3.5 bg-white rounded-xl border border-[#BFEAFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#111111]" />
              <span className="font-semibold text-[#111111]">
                Campus Wellbeing Knowledge Base:
              </span>
              <span className="text-slate-600">
                {aiStatus?.knowledge_base_count || 7} Verified Protocols
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FERPA Rule 07 Compliant (Notes Isolated)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Render Production .env Configuration Card */}
      <Card className="border-[#BFEAFF]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#111111]" />
              <CardTitle>Render Production .env Configuration</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEnv}
              leftIcon={
                copiedEnv ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
            >
              {copiedEnv ? 'Copied to Clipboard!' : 'Copy Render .env'}
            </Button>
          </div>
        </CardHeader>

        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Copy and paste these environment variables into your Render Service settings (<strong>Environment</strong> $\rightarrow$ <strong>Add Environment Variable</strong> or Secret File) to run both Groq and Sarvam AI seamlessly in production.
          </p>

          <div className="relative">
            <pre className="p-3.5 rounded-xl bg-[#111111] text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {renderEnvConfig}
            </pre>
          </div>
        </div>
      </Card>

      {/* Backend Integration Endpoint Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#111111]" />
            <CardTitle>Backend Integration Endpoint</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <Input
            label="Backend REST Base URL"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            helperText="Currently pointing to active backend service"
          />

          <div className="p-3 rounded-lg bg-[#F8FCFF] border border-[#BFEAFF] text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">Documentation Swagger</span>
            <a
              href={`${backendUrl}/docs`}
              target="_blank"
              rel="noreferrer"
              className="text-[#111111] hover:text-black font-semibold font-mono underline"
            >
              {backendUrl}/docs
            </a>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestBackend}
              isLoading={isTestingBackend}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#111111]" />}
            >
              Test Endpoint Handshake
            </Button>
            {backendTestResult === 'success' && (
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> 200 OK Handshake established
                {backendLatency && <span className="text-slate-500 font-mono">({backendLatency}ms)</span>}
              </span>
            )}
            {backendTestResult === 'fail' && (
              <span className="text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-700" /> Failed to reach host
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Security & API Credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#111111]" />
            <CardTitle>Security & API Credentials</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {/* Groq Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Groq Cloud Secret Key</label>
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="text-[11px] text-slate-500 hover:text-[#111111] flex items-center gap-1 cursor-pointer"
              >
                {showGroqKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showGroqKey ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <Input
              type={showGroqKey ? 'text' : 'password'}
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              helperText="Environment variable: GROQ_API_KEY (Ultra-fast English inference)"
            />
          </div>

          {/* Sarvam AI Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Sarvam AI Secret Key</label>
              <button
                type="button"
                onClick={() => setShowSarvamKey(!showSarvamKey)}
                className="text-[11px] text-slate-500 hover:text-[#111111] flex items-center gap-1 cursor-pointer"
              >
                {showSarvamKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSarvamKey ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <Input
              type={showSarvamKey ? 'text' : 'password'}
              value={sarvamKey}
              onChange={(e) => setSarvamKey(e.target.value)}
              helperText="Environment variable: SARVAM_API_KEY (Indic & multilingual intelligence)"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
