import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true) // Start as true to avoid login screen flicker
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // Added for password login
  const [mantraName, setMantraName] = useState('శివా')
  const [count, setCount] = useState(0)
  const [totals, setTotals] = useState([])

  // Single source of truth for Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

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
      const summary = data.reduce((acc, curr) => {
        if (!acc[curr.mantra_name]) acc[curr.mantra_name] = { total: 0, days: 0 }
        acc[curr.mantra_name].total += curr.count_added
        acc[curr.mantra_name].days += 1
        return acc
      }, {})
      setTotals(Object.entries(summary))
    }
  }

  // Support for BOTH Password and Magic Link
  const handleAuth = async (type) => {
    setLoading(true)
    let error;
    if (type === 'LOGIN') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      error = err
    } else if (type === 'SIGNUP') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      error = err
      if (!error) alert('Signup successful! You can now login.')
    } else {
      const { error: err } = await supabase.auth.signInWithOtp({ email })
      error = err
      if (!error) alert('Check email for link!')
    }
    
    if (error) alert(error.message)
    setLoading(false)
  }

  const addCount = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('mantra_logs')
      .insert([{ user_id: session.user.id, mantra_name: mantraName, count_added: parseInt(count) }])
    
    if (error) alert(error.message)
    else { setCount(0); fetchTotals() }
  }

  if (loading && !session) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>

  if (!session) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>SriVidya Login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding:'10px'}} />
          <input type="password" placeholder="Password (Optional for Magic Link)" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding:'10px'}} />
          
          <button onClick={() => handleAuth('LOGIN')} style={{padding:'10px', background: '#4A148C', color: 'white', border: 'none', borderRadius: '5px'}}>Login with Password</button>
          <button onClick={() => handleAuth('OTP')} style={{padding:'10px', background: 'white', border: '1px solid #4A148C'}}>Send Magic Link</button>
          <button onClick={() => handleAuth('SIGNUP')} style={{padding:'5px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer'}}>Create New Account</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h2 style={{margin:0}}>🕉️ SriVidya Tracker</h2>
           <small style={{color:'#666'}}>{session.user.email}</small>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer'}}>Logout</button>
      </header>

      {/* Entry Form */}
      <div style={{ background: '#FFF8E1', padding: '20px', borderRadius: '15px', margin: '30px 0', border: '1px solid #FFD54F' }}>
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
        {totals.length === 0 && <p style={{textAlign:'center', gridColumn: '1/-1', color: '#999'}}>No data found. Start by adding a count above!</p>}
      </div>
    </div>
  )
}

export default App