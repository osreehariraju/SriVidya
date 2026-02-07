import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [username, setUsername] = useState('') // Changed from email
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // We turn "username" into a fake email for Supabase
    const internalEmail = `${username.toLowerCase().trim()}@srividya.app`

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ 
        email: internalEmail, 
        password: password 
      })
      if (error) alert(error.message)
      else alert('Account created successfully!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: internalEmail, 
        password: password 
      })
      if (error) alert("Invalid username or password")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-purple-700">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">SriVidya</h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Username</label>
            <input 
              type="text" 
              placeholder="e.g. siva_108" 
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button disabled={loading} className="w-full py-3 bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:bg-purple-800 transition">
            {loading ? 'Wait...' : (isSignUp ? 'Register' : 'Enter')}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-6 text-purple-700 text-sm hover:underline">
          {isSignUp ? 'Already have a username? Login' : "Don't have an account? Pick a username"}
        </button>
      </div>
    </div>
  )
}