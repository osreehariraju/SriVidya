export default function StatsGrid({ totals }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {totals.map(([name, data]) => (
        <div 
          key={name} 
          className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-600 hover:shadow-md transition"
        >
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">{name}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-gray-900">{data.total.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">total</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <span className="text-purple-700 font-bold">{data.days}</span>
            <span className="text-gray-400 text-xs italic">Days of Sadhana</span>
          </div>
        </div>
      ))}
      {totals.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-400 italic">
          No logs found yet. Start your journey above.
        </div>
      )}
    </div>
  )
}