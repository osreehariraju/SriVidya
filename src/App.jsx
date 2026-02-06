import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [mantraName, setMantraName] = useState('శివా')
  const [count, setCount] = useState(0)
  const [totals, setTotals] = useState([]) // To store our calculated data

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Fetch data whenever the session changes or after a new entry
  useEffect(() => {
    if (session) fetchTotals()
  }, [session])

  const fetchTotals = async () => {
    const { data, error } = await supabase
      .from('mantra_logs')
      .select('mantra_name, count_added')
      .eq('user_id', session.user.id)

    if (error) console.log('Error fetching:', error)
    else {
      // Group and Sum logic
      const summary = data.reduce((acc, curr) => {
        if (!acc[curr.mantra_name]) {
          acc[curr.mantra_name] = { total: 0, days: 0 }
        }
        acc[curr.mantra_name].total += curr.count_added
        acc[curr.mantra_name].days += 1
        return acc;
      }, {})
      setTotals(Object.entries(summary))
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message); else alert('Check your email!');
    setLoading(false)
  }

  const addCount = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('mantra_logs')
      .insert([{ user_id: session.user.id, mantra_name: mantraName, count_added: parseInt(count) }])
    
    if (error) alert(error.message)
    else {
      setCount(0)
      fetchTotals() // Refresh the list immediately
    }
  }

  if (!session) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>SriVidya Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding:'10px'}} />
          <button disabled={loading} style={{padding:'10px', marginLeft:'5px'}}>Send Magic Link</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🕉️ SriVidya Tracker</h2>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </header>

      {/* Entry Form */}
      <div style={{ background: '#FFF8E1', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #FFD54F' }}>
        <h4 style={{marginTop: 0}}>Log Today's Sadhana</h4>
        <form onSubmit={addCount} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={mantraName} onChange={(e) => setMantraName(e.target.value)} style={{padding: '10px', borderRadius: '5px'}}>
            <option value="శివా">శివా</option>
            <option value="గురు">గురు</option>
            <option value="మానసా">మానసా</option>
          </select>
          <input type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder="Count" style={{padding: '10px', borderRadius: '5px', width: '80px'}} />
          <button type="submit" style={{padding: '10px 20px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Update</button>
        </form>
      </div>

      {/* Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {totals.map(([name, data]) => (
          <div key={name} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '5px solid #673AB7' }}>
            <h3 style={{margin: '0 0 10px 0', color: '#673AB7'}}>{name}</h3>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{data.total}</div>
            <div style={{color: '#666', fontSize: '14px'}}>Total Chants</div>
            <hr style={{margin: '15px 0', opacity: 0.2}} />
            <div style={{fontSize: '18px'}}>{data.days}</div>
            <div style={{color: '#666', fontSize: '14px'}}>Days Completed</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App