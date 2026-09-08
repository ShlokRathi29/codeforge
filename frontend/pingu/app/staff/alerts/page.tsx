'use client'

import { useState } from 'react'
import { staffAlerts } from '@/lib/staff-data'
import { AlertFilters, AlertList, PageHeader, PrivacyBadge } from '@/components/staff/staff-ui'

export default function AlertsPage() { const [alerts, setAlerts] = useState(staffAlerts); const [query, setQuery] = useState(''); const [status, setStatus] = useState('all'); const filtered = alerts.filter((a) => (status === 'all' || a.status === status) && `${a.kind} ${a.studentName} ${a.id}`.toLowerCase().includes(query.toLowerCase())); return <><PageHeader eyebrow="Alerts" title="Support, not surveillance." description="These alerts are generated from predefined patterns and never include private reflections or journal text." action={<PrivacyBadge />} /><div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7"><AlertFilters query={query} setQuery={setQuery} status={status} setStatus={setStatus} /><AlertList alerts={filtered} onStatus={(id, status) => setAlerts((items) => items.map((a) => a.id === id ? { ...a, status } : a))} /></div></> }
