import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import SadhanaForm from './components/SadhanaForm'
import StatsGrid from './components/StatsGrid'

function App() {
  const [session, setSession] = useState(null)
  const [totals, setTotals] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  useEffect(() => {
    if (session) fetchTotals()
  }, [session])

  const fetchTotals = async () => {
    const { data } = await supabase.from('mantra_logs').select('*').eq('user_id', session.user.id)
    const summary = data.reduce((acc, curr) => {
      if (!acc[curr.mantra_name]) acc[curr.mantra_name] = { total: 0, days: 0 }
      acc[curr.mantra_name].total += curr.count_added
      acc[curr.mantra_name].days += 1
      return acc
    }, {})
    setTotals(Object.entries(summary))
  }

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
       <header className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-2xl font-bold text-purple-900">🕉️ SriVidya Tracker</h1>
    {/* This splits the fake email and just shows the first part (the username) */}
    <p className="text-sm text-gray-500 font-medium">
      Welcome, <span className="text-purple-700 capitalize">{session.user.email.split('@')[0]}</span>
    </p>
  </div>
  <button 
    onClick={() => supabase.auth.signOut()}
    className="text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
  >
    Logout
  </button>
</header>

        <SadhanaForm userId={session.user.id} onUpdate={fetchTotals} />
        <StatsGrid totals={totals} />
      </div>
    </div>
  )
}

export default App