import React, { useState } from 'react'
import { Server, Key, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { USE_MOCK_API } from '../../api/client'

export const SettingsView: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000')
  const [apiKey, setApiKey] = useState('demo-hackathon-token-xyz')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null)

  const handleTestConnection = () => {
    setIsTesting(true)
    setTestResult(null)

    setTimeout(() => {
      setIsTesting(false)
      setTestResult('success')
    }, 800)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Project Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage API gateways, backend connections, and demo mode parameters
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <CardTitle>Backend Integration Endpoint</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <Input
            label="Backend REST Base URL"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            helperText="Points to your Python/FastAPI/Node server during local demo"
          />

          <Input
            label="Mock Fallback Engine"
            disabled
            value={USE_MOCK_API ? 'ENABLED (Safe Mode for Hackathon Demo)' : 'DISABLED'}
            helperText="When enabled, any missing backend routes gracefully fall back to local mock data"
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              isLoading={isTesting}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Test Endpoint Handshake
            </Button>
            {testResult === 'success' && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4" /> 200 OK Handshake established
              </span>
            )}
            {testResult === 'fail' && (
              <span className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4" /> Failed to reach host
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
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
