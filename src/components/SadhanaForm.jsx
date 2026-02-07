import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SadhanaForm({ userId, onUpdate }) {
  const [mantra, setMantra] = useState('శివా')
  const [count, setCount] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (count <= 0) return
    const { error } = await supabase
      .from('mantra_logs')
      .insert([{ user_id: userId, mantra_name: mantra, count_added: parseInt(count) }])
    
    if (!error) {
      setCount(0)
      onUpdate()
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 shadow-sm">
      <h3 className="text-amber-900 font-semibold mb-4">Log Daily Sadhana</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <select 
          value={mantra} 
          onChange={(e) => setMantra(e.target.value)}
          className="flex-1 p-3 rounded-xl border-gray-200 outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="శివా">శివా</option>
          <option value="గురు">గురు</option>
          <option value="మానసా">మానసా</option>
        </select>
        <input 
          type="number" 
          value={count} 
          onChange={(e) => setCount(e.target.value)}
          className="w-full sm:w-32 p-3 rounded-xl border-gray-200 outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Count"
        />
        <button 
          type="submit" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-md active:scale-95"
        >
          Update
        </button>
      </form>
    </div>
  )
}