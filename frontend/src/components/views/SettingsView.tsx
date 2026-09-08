import React, { useState } from 'react'
import { Server, Key, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { API_BASE_URL } from '../../api/client'

export const SettingsView: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState(API_BASE_URL)
  const [apiKey, setApiKey] = useState('demo-hackathon-token-xyz')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null)
  const [latency, setLatency] = useState<number | null>(null)

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    setLatency(null)

    const start = performance.now()
    try {
      const res = await fetch(`${backendUrl}/health`)
      const elapsed = Math.round(performance.now() - start)
      if (res.ok) {
        const data = await res.json()
        if (data?.status === 'ok') {
          setTestResult('success')
          setLatency(elapsed)
          return
        }
      }
      setTestResult('fail')
    } catch (err) {
      console.error('[SettingsView] Handshake failed:', err)
      setTestResult('fail')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Project Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage API gateways, backend connections, and demo mode parameters
        </p>
      </div>

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
            helperText="Currently pointing to hosted backend on Render"
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
              onClick={handleTestConnection}
              isLoading={isTesting}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#111111]" />}
            >
              Test Endpoint Handshake
            </Button>
            {testResult === 'success' && (
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> 200 OK Handshake established
                {latency && <span className="text-slate-500 font-mono">({latency}ms)</span>}
              </span>
            )}
            {testResult === 'fail' && (
              <span className="text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-700" /> Failed to reach host
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#111111]" />
            <CardTitle>Security & API Credentials</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <Input
            type="password"
            label="LLM / Service Secret Token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            helperText="Configured in frontend environment (.env.local)"
          />
        </div>
      </Card>
    </div>
  )
}
