// 'use client'
// import { useState, useMemo } from 'react'
// import * as XLSX from 'xlsx'
// import { generateDataset } from '@/lib/api'

// const PRESETS = [
//   { label: '🎓 Students', prompt: 'rows of Indian university student records with student_name, department (CSE, ECE, ME, MBA), year (1st, 2nd, 3rd, 4th), CGPA (5.0 to 10.0), attendance (50 to 100), result (Pass, Fail)' },
//   { label: '🏥 Hospital', prompt: 'rows of Indian hospital patient records with patient_name, age (10 to 80), city, blood_group (A+, B+, O+, AB+), disease (Diabetes, Fever, Fracture, Asthma, Hypertension), ward (General, ICU, Private), bill_amount (5000 to 200000), status (Discharged, Admitted)' },
//   { label: '📈 Stocks', prompt: 'rows of Indian stock data with company_name (TCS, Infosys, Reliance, HDFC, Wipro, ITC, SBI, Bajaj, Maruti, Sun Pharma), sector (IT, Banking, Pharma, Auto, FMCG), stock_price (100 to 5000), PE_ratio (5 to 80), analyst_rating (Buy, Hold, Sell)' },
//   { label: '🛒 E-commerce', prompt: 'rows of Indian e-commerce orders with customer_name, city, product_category (Electronics, Clothing, Books, Food, Sports), order_amount (200 to 50000), payment_method (UPI, Credit Card, COD, Net Banking), status (Delivered, Pending, Cancelled)' },
//   { label: '👔 HR / Jobs', prompt: 'rows of Indian employee data with employee_name, city, department (Engineering, Sales, HR, Finance, Marketing), salary (20000 to 200000), experience_years (0 to 20), performance_rating (1 to 5), status (Active, Resigned, Terminated)' },
//   { label: '🏏 Cricket', prompt: 'rows of cricket player data with player_name, country (India, Australia, England, Pakistan, South Africa), matches (10 to 300), runs (100 to 15000), batting_average (20 to 65), wickets (0 to 500), role (Batsman, Bowler, All-rounder, Wicket-keeper), format (Test, ODI, T20)' },
// ]

// const LOCALES = [
//   { label: '🇮🇳 All India', value: 'Indian' },
//   { label: '🏙️ North India', value: 'North Indian (Delhi, UP, Punjab, Haryana, Rajasthan)' },
//   { label: '🌊 South India', value: 'South Indian (Chennai, Bangalore, Hyderabad, Kerala)' },
//   { label: '🏭 Maharashtra', value: 'Maharashtra (Mumbai, Pune, Nagpur)' },
//   { label: '💼 Gujarat', value: 'Gujarat (Ahmedabad, Surat, Vadodara)' },
//   { label: '🌿 East India', value: 'East Indian (Kolkata, Bhubaneswar, Patna)' },
// ]

// export default function GeneratePage() {
//   const [prompt, setPrompt] = useState('')
//   const [rows, setRows] = useState<number>(100)
//   const [data, setData] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [page, setPage] = useState(0)
//   const [sortCol, setSortCol] = useState<string>('')
//   const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
//   const [search, setSearch] = useState('')
//   const [locale, setLocale] = useState(LOCALES[0].value)
//   const [history, setHistory] = useState<{ prompt: string; rows: number; columns: number; time: string }[]>([])
//   const [showHistory, setShowHistory] = useState(false)

//   const PAGE_SIZE = 20

//   const handleGenerate = async (customPrompt?: string) => {
//     const finalPrompt = customPrompt || prompt
//     if (!finalPrompt.trim()) return
//     setLoading(true)
//     setError('')
//     setPage(0)
//     setSortCol('')
//     setSearch('')
//     try {
//       const fullPrompt = `${rows} ${finalPrompt}. Use ${locale} names and cities.`
//       const result = await generateDataset(fullPrompt, rows)
//       setData(result)
//       setHistory(prev => [
//         { prompt: finalPrompt, rows: result.rows.length, columns: result.columns.length, time: new Date().toLocaleTimeString() },
//         ...prev.slice(0, 4)
//       ])
//     } catch (e: any) {
//       setError('Something went wrong. Try fewer rows or simpler prompt.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePreset = (preset: typeof PRESETS[0]) => {
//     setPrompt(preset.prompt)
//   }

//   const downloadExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(data.rows)
//     const wb = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(wb, ws, 'Dataset')
//     XLSX.writeFile(wb, 'dataset.xlsx')
//   }

//   const downloadJSON = () => {
//     const json = JSON.stringify(data.rows, null, 2)
//     const blob = new Blob([json], { type: 'application/json' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'dataset.json'
//     a.click()
//   }

//   const downloadCSV = () => {
//     const headers = data.columns.join(',')
//     const csvRows = data.rows.map((row: any) =>
//       data.columns.map((col: string) => {
//         const val = String(row[col])
//         return val.includes(',') ? `"${val}"` : val
//       }).join(',')
//     )
//     const csv = [headers, ...csvRows].join('\n')
//     const blob = new Blob([csv], { type: 'text/csv' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'dataset.csv'
//     a.click()
//   }

//   const downloadSQL = () => {
//     const tableName = 'dataset'
//     const columns = data.columns.map((col: string) => `  \`${col}\` VARCHAR(255)`).join(',\n')
//     const createTable = `CREATE TABLE \`${tableName}\` (\n${columns}\n);\n\n`
//     const inserts = data.rows.map((row: any) => {
//       const values = data.columns.map((col: string) => {
//         const val = String(row[col]).replace(/'/g, "''")
//         return `'${val}'`
//       }).join(', ')
//       return `INSERT INTO \`${tableName}\` (${data.columns.map((c: string) => `\`${c}\``).join(', ')}) VALUES (${values});`
//     }).join('\n')
//     const sql = createTable + inserts
//     const blob = new Blob([sql], { type: 'text/plain' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'dataset.sql'
//     a.click()
//   }

//   const downloadXML = () => {
//     const xmlRows = data.rows.map((row: any) => {
//       const fields = data.columns.map((col: string) => {
//         const val = String(row[col])
//           .replace(/&/g, '&amp;')
//           .replace(/</g, '&lt;')
//           .replace(/>/g, '&gt;')
//         return `    <${col}>${val}</${col}>`
//       }).join('\n')
//       return `  <record>\n${fields}\n  </record>`
//     }).join('\n')
//     const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>\n${xmlRows}\n</dataset>`
//     const blob = new Blob([xml], { type: 'application/xml' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'dataset.xml'
//     a.click()
//   }

//   const handleSort = (col: string) => {
//     if (sortCol === col) {
//       setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
//     } else {
//       setSortCol(col)
//       setSortDir('asc')
//     }
//     setPage(0)
//   }

//   const filteredAndSortedRows = useMemo(() => {
//     if (!data) return []
//     let result = data.rows
//     if (search.trim()) {
//       result = result.filter((row: any) =>
//         data.columns.some((col: string) =>
//           String(row[col]).toLowerCase().includes(search.toLowerCase())
//         )
//       )
//     }
//     if (sortCol) {
//       result = [...result].sort((a, b) => {
//         const aVal = String(a[sortCol]).toLowerCase()
//         const bVal = String(b[sortCol]).toLowerCase()
//         if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
//         if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
//         return 0
//       })
//     }
//     return result
//   }, [data, sortCol, sortDir, search])

//   const totalPages = Math.ceil(filteredAndSortedRows.length / PAGE_SIZE)
//   const currentRows = filteredAndSortedRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

//   const numericStats = useMemo(() => {
//     if (!data) return {}
//     const stats: any = {}
//     data.columns.forEach((col: string) => {
//       const vals = data.rows.map((r: any) => Number(r[col])).filter((v: number) => !isNaN(v))
//       if (vals.length > 0) {
//         stats[col] = {
//           min: Math.min(...vals).toFixed(1),
//           max: Math.max(...vals).toFixed(1),
//           avg: (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1)
//         }
//       }
//     })
//     return stats
//   }, [data])

//   return (
//     <main className="min-h-screen bg-[#f7f8fc] text-gray-800 p-8">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-4xl font-bold mb-1 text-gray-900">PromptData</h1>
//           <p className="text-gray-500">Describe your dataset. Get it instantly.</p>
//         </div>
//         <button
//           onClick={() => setShowHistory(!showHistory)}
//           className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg text-sm transition-colors text-gray-700 shadow-sm"
//         >
//           🕘 History {history.length > 0 && (
//             <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">{history.length}</span>
//           )}
//         </button>
//       </div>

//       {/* History panel */}
//       {showHistory && (
//         <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
//           <h2 className="text-sm font-semibold text-gray-500 mb-3">Recent Generations</h2>
//           {history.length === 0 ? (
//             <p className="text-gray-400 text-sm">No history yet. Generate a dataset first!</p>
//           ) : (
//             <div className="space-y-2">
//               {history.map((h, i) => (
//                 <div
//                   key={i}
//                   onClick={() => { setPrompt(h.prompt); setShowHistory(false) }}
//                   className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-4 py-2 cursor-pointer transition-colors"
//                 >
//                   <p className="text-sm text-gray-700 truncate max-w-xl">{h.prompt}</p>
//                   <div className="flex items-center gap-3 ml-4 shrink-0">
//                     <span className="text-xs text-gray-600 font-medium">{h.rows} rows</span>
//                     <span className="text-xs text-gray-500 font-medium">{h.columns} cols</span>
//                     <span className="text-xs text-gray-400">{h.time}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Preset templates */}
//       <div className="mb-4">
//         <p className="text-xs text-gray-400 mb-2">Quick templates:</p>
//         <div className="flex flex-wrap gap-2">
//           {PRESETS.map((preset) => (
//             <button
//               key={preset.label}
//               onClick={() => handlePreset(preset)}
//               className="bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-400 text-sm px-4 py-1.5 rounded-full transition-colors text-gray-700 shadow-sm"
//             >
//               {preset.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Input area */}
//       <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
//         <textarea
//           className="w-full bg-white rounded-xl p-4 text-gray-800 border border-gray-200 focus:border-gray-400 outline-none resize-none h-32 mb-4 placeholder-gray-400"
//           placeholder="e.g. 500 rows of university student records with name, department, CGPA, attendance, and result"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         />
//         <div className="flex items-center gap-3 flex-wrap">
//           <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
//             <span className="text-gray-500 text-sm">Rows:</span>
//             <input
//               type="number"
//               className="bg-transparent w-20 text-gray-800 outline-none text-sm"
//               value={rows}
//               onChange={(e) => setRows(Number(e.target.value))}
//               min={10} max={1000}
//             />
//           </div>
//           <select
//             value={locale}
//             onChange={(e) => setLocale(e.target.value)}
//             className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
//           >
//             {LOCALES.map(l => (
//               <option key={l.value} value={l.value}>{l.label}</option>
//             ))}
//           </select>
//           <button
//             onClick={() => handleGenerate()}
//             disabled={loading}
//             className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors shadow-sm"
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <span className="animate-spin">⏳</span> Generating...
//               </span>
//             ) : '✨ Generate Dataset'}
//           </button>
//           {data && (
//             <div className="ml-auto flex items-center gap-2 flex-wrap">
//               <span className="text-gray-400 text-sm">Download:</span>
//               <button onClick={downloadExcel}
//                 className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
//                 📊 Excel
//               </button>
//               <button onClick={downloadJSON}
//                 className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
//                 { } JSON
//               </button>
//               <button onClick={downloadCSV}
//                 className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
//                 📄 CSV
//               </button>
//               <button onClick={downloadSQL}
//                 className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
//                 🗄️ SQL
//               </button>
//               <button onClick={downloadXML}
//                 className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
//                 📋 XML
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
//           ⚠️ {error}
//         </div>
//       )}

//       {/* Loading skeleton */}
//       {loading && (
//         <div className="mt-4 space-y-2 animate-pulse">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="h-10 bg-gray-100 rounded-lg w-full" />
//           ))}
//         </div>
//       )}

//       {data && !loading && (
//         <div className="mt-2">

//           {/* Stats cards */}
//           {Object.keys(numericStats).length > 0 && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//               {Object.entries(numericStats).slice(0, 4).map(([col, s]: any) => (
//                 <div key={col} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
//                   <p className="text-xs text-gray-400 mb-1 truncate">{col}</p>
//                   <div className="flex justify-between text-xs">
//                     <span className="text-blue-500 font-medium">min {s.min}</span>
//                     <span className="text-gray-700 font-medium">avg {s.avg}</span>
//                     <span className="text-red-500 font-medium">max {s.max}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Info + search */}
//           <div className="flex items-center justify-between mb-3 gap-4">
//             <div className="flex items-center gap-3">
//               <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
//                 {data.rows.length} rows
//               </span>
//               <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
//                 {data.columns.length} columns
//               </span>
//               {sortCol && (
//                 <span className="text-xs text-gray-500">
//                   Sorted by <span className="text-gray-800 font-medium">{sortCol}</span> ({sortDir})
//                   <button onClick={() => setSortCol('')} className="ml-2 text-red-400 hover:text-red-500">✕</button>
//                 </span>
//               )}
//             </div>
//             <input
//               type="text"
//               placeholder="🔍 Search any value..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(0) }}
//               className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 outline-none focus:border-gray-400 w-56 shadow-sm"
//             />
//           </div>

//           {search && (
//             <p className="text-xs text-gray-400 mb-2">Found {filteredAndSortedRows.length} matching rows</p>
//           )}

//           <p className="text-xs text-gray-400 mb-2">💡 Click any column header to sort</p>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr>
//                   {data.columns.map((col: string) => (
//                     <th
//                       key={col}
//                       onClick={() => handleSort(col)}
//                       className="bg-gray-100 p-3 text-left border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-gray-200 select-none whitespace-nowrap font-semibold"
//                     >
//                       {col} {sortCol === col ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((row: any, i: number) => (
//                   <tr key={i} className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
//                     {data.columns.map((col: string) => (
//                       <td key={col} className="p-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
//                         {String(row[col])}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-gray-400 text-sm">
//               Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} rows
//             </p>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setPage(0)} disabled={page === 0}
//                 className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">« First</button>
//               <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
//                 className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">‹ Prev</button>
//               <span className="text-gray-500 text-sm px-2">Page {page + 1} of {totalPages}</span>
//               <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
//                 className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">Next ›</button>
//               <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
//                 className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">Last »</button>
//             </div>
//           </div>

//         </div>
//       )}
//     </main>
//   )
// }


'use client'
import { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { generateDataset } from '@/lib/api'

const PRESETS = [
  { label: '🎓 Students', prompt: 'rows of Indian university student records with student_name, department (CSE, ECE, ME, MBA), year (1st, 2nd, 3rd, 4th), CGPA (5.0 to 10.0), attendance (50 to 100), result (Pass, Fail)' },
  { label: '🏥 Hospital', prompt: 'rows of Indian hospital patient records with patient_name, age (10 to 80), city, blood_group (A+, B+, O+, AB+), disease (Diabetes, Fever, Fracture, Asthma, Hypertension), ward (General, ICU, Private), bill_amount (5000 to 200000), status (Discharged, Admitted)' },
  { label: '📈 Stocks', prompt: 'rows of Indian stock data with company_name (TCS, Infosys, Reliance, HDFC, Wipro, ITC, SBI, Bajaj, Maruti, Sun Pharma), sector (IT, Banking, Pharma, Auto, FMCG), stock_price (100 to 5000), PE_ratio (5 to 80), analyst_rating (Buy, Hold, Sell)' },
  { label: '🛒 E-commerce', prompt: 'rows of Indian e-commerce orders with customer_name, city, product_category (Electronics, Clothing, Books, Food, Sports), order_amount (200 to 50000), payment_method (UPI, Credit Card, COD, Net Banking), status (Delivered, Pending, Cancelled)' },
  { label: '👔 HR / Jobs', prompt: 'rows of Indian employee data with employee_name, city, department (Engineering, Sales, HR, Finance, Marketing), salary (20000 to 200000), experience_years (0 to 20), performance_rating (1 to 5), status (Active, Resigned, Terminated)' },
  { label: '🏏 Cricket', prompt: 'rows of cricket player data with player_name, country (India, Australia, England, Pakistan, South Africa), matches (10 to 300), runs (100 to 15000), batting_average (20 to 65), wickets (0 to 500), role (Batsman, Bowler, All-rounder, Wicket-keeper), format (Test, ODI, T20)' },
]

const LOCALES = [
  { label: '🇮🇳 All India', value: 'Indian' },
  { label: '🏙️ North India', value: 'North Indian (Delhi, UP, Punjab, Haryana, Rajasthan)' },
  { label: '🌊 South India', value: 'South Indian (Chennai, Bangalore, Hyderabad, Kerala)' },
  { label: '🏭 Maharashtra', value: 'Maharashtra (Mumbai, Pune, Nagpur)' },
  { label: '💼 Gujarat', value: 'Gujarat (Ahmedabad, Surat, Vadodara)' },
  { label: '🌿 East India', value: 'East Indian (Kolkata, Bhubaneswar, Patna)' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [rows, setRows] = useState<number>(100)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')
  const [locale, setLocale] = useState(LOCALES[0].value)
  const [history, setHistory] = useState<{ prompt: string; rows: number; columns: number; time: string }[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const PAGE_SIZE = 20

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt
    if (!finalPrompt.trim()) return
    setLoading(true)
    setError('')
    setPage(0)
    setSortCol('')
    setSearch('')
    try {
      const fullPrompt = `${rows} ${finalPrompt}. Use ${locale} names and cities.`
      const result = await generateDataset(fullPrompt, rows)
      setData(result)
      setHistory(prev => [
        { prompt: finalPrompt, rows: result.rows.length, columns: result.columns.length, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ])
    } catch (e: any) {
      setError('Something went wrong. Try fewer rows or simpler prompt.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setPrompt(preset.prompt)
  }

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dataset')
    XLSX.writeFile(wb, 'dataset.xlsx')
  }

  const downloadJSON = () => {
    const json = JSON.stringify(data.rows, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dataset.json'
    a.click()
  }

  const downloadCSV = () => {
    const headers = data.columns.join(',')
    const csvRows = data.rows.map((row: any) =>
      data.columns.map((col: string) => {
        const val = String(row[col])
        return val.includes(',') ? `"${val}"` : val
      }).join(',')
    )
    const csv = [headers, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dataset.csv'
    a.click()
  }

  const downloadSQL = () => {
    const tableName = 'dataset'
    const columns = data.columns.map((col: string) => `  \`${col}\` VARCHAR(255)`).join(',\n')
    const createTable = `CREATE TABLE \`${tableName}\` (\n${columns}\n);\n\n`
    const inserts = data.rows.map((row: any) => {
      const values = data.columns.map((col: string) => {
        const val = String(row[col]).replace(/'/g, "''")
        return `'${val}'`
      }).join(', ')
      return `INSERT INTO \`${tableName}\` (${data.columns.map((c: string) => `\`${c}\``).join(', ')}) VALUES (${values});`
    }).join('\n')
    const sql = createTable + inserts
    const blob = new Blob([sql], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dataset.sql'
    a.click()
  }

  const downloadXML = () => {
    const xmlRows = data.rows.map((row: any) => {
      const fields = data.columns.map((col: string) => {
        const val = String(row[col])
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        return `    <${col}>${val}</${col}>`
      }).join('\n')
      return `  <record>\n${fields}\n  </record>`
    }).join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>\n${xmlRows}\n</dataset>`
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dataset.xml'
    a.click()
  }

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
    setPage(0)
  }

  const filteredAndSortedRows = useMemo(() => {
    if (!data) return []
    let result = data.rows
    if (search.trim()) {
      result = result.filter((row: any) =>
        data.columns.some((col: string) =>
          String(row[col]).toLowerCase().includes(search.toLowerCase())
        )
      )
    }
    if (sortCol) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortCol]).toLowerCase()
        const bVal = String(b[sortCol]).toLowerCase()
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [data, sortCol, sortDir, search])

  const totalPages = Math.ceil(filteredAndSortedRows.length / PAGE_SIZE)
  const currentRows = filteredAndSortedRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const numericStats = useMemo(() => {
    if (!data) return {}
    const stats: any = {}
    data.columns.forEach((col: string) => {
      const vals = data.rows.map((r: any) => Number(r[col])).filter((v: number) => !isNaN(v))
      if (vals.length > 0) {
        stats[col] = {
          min: Math.min(...vals).toFixed(1),
          max: Math.max(...vals).toFixed(1),
          avg: (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1)
        }
      }
    })
    return stats
  }, [data])

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-gray-800 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-1 text-gray-900">PromptData</h1>
          <p className="text-gray-500">Describe your dataset. Get it instantly.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg text-sm transition-colors text-gray-700 shadow-sm"
        >
          🕘 History {history.length > 0 && (
            <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">{history.length}</span>
          )}
        </button>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">Recent Generations</h2>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">No history yet. Generate a dataset first!</p>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => { setPrompt(h.prompt); setShowHistory(false) }}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-4 py-2 cursor-pointer transition-colors"
                >
                  <p className="text-sm text-gray-700 truncate max-w-xl">{h.prompt}</p>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="text-xs text-gray-600 font-medium">{h.rows} rows</span>
                    <span className="text-xs text-gray-500 font-medium">{h.columns} cols</span>
                    <span className="text-xs text-gray-400">{h.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setHistory(prev => prev.filter((_, idx) => idx !== i))
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors text-xs font-bold ml-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preset templates */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Quick templates:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className="bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-400 text-sm px-4 py-1.5 rounded-full transition-colors text-gray-700 shadow-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <textarea
          className="w-full bg-white rounded-xl p-4 text-gray-800 border border-gray-200 focus:border-gray-400 outline-none resize-none h-32 mb-4 placeholder-gray-400"
          placeholder="e.g. 500 rows of university student records with name, department, CGPA, attendance, and result"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-gray-500 text-sm">Rows:</span>
            <input
              type="number"
              className="bg-transparent w-20 text-gray-800 outline-none text-sm"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              min={10} max={100000}
            />
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            {LOCALES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Generating...
              </span>
            ) : '✨ Generate Dataset'}
          </button>
          {data && (
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <span className="text-gray-400 text-sm">Download:</span>
              <button onClick={downloadExcel}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                📊 Excel
              </button>
              <button onClick={downloadJSON}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                {'{ }'} JSON
              </button>
              <button onClick={downloadCSV}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                📄 CSV
              </button>
              <button onClick={downloadSQL}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                🗄️ SQL
              </button>
              <button onClick={downloadXML}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                📋 XML
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-4 space-y-2 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg w-full" />
          ))}
        </div>
      )}

      {data && !loading && (
        <div className="mt-2">

          {/* Stats cards */}
          {Object.keys(numericStats).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.entries(numericStats).slice(0, 4).map(([col, s]: any) => (
                <div key={col} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1 truncate">{col}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-500 font-medium">min {s.min}</span>
                    <span className="text-gray-700 font-medium">avg {s.avg}</span>
                    <span className="text-red-500 font-medium">max {s.max}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info + search */}
          <div className="flex items-center justify-between mb-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                {data.rows.length} rows
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                {data.columns.length} columns
              </span>
              {sortCol && (
                <span className="text-xs text-gray-500">
                  Sorted by <span className="text-gray-800 font-medium">{sortCol}</span> ({sortDir})
                  <button onClick={() => setSortCol('')} className="ml-2 text-red-400 hover:text-red-500">✕</button>
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="🔍 Search any value..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-700 outline-none focus:border-gray-400 w-56 shadow-sm"
            />
          </div>

          {search && (
            <p className="text-xs text-gray-400 mb-2">Found {filteredAndSortedRows.length} matching rows</p>
          )}

          <p className="text-xs text-gray-400 mb-2">💡 Click any column header to sort</p>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {data.columns.map((col: string) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="bg-gray-100 p-3 text-left border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-gray-200 select-none whitespace-nowrap font-semibold"
                    >
                      {col} {sortCol === col ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    {data.columns.map((col: string) => (
                      <td key={col} className="p-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-400 text-sm">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} rows
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(0)} disabled={page === 0}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">« First</button>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">‹ Prev</button>
              <span className="text-gray-500 text-sm px-2">Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">Next ›</button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-sm shadow-sm">Last »</button>
            </div>
          </div>

        </div>
      )}
    </main>
  )
}
