import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine, Cell
} from 'recharts'
import { getMeals, getGoals } from '../api'
import toast from 'react-hot-toast'

function RoundedBar({ x, y, width, height, fill }) {
  if (!height || height <= 0) return null
  const r = Math.min(6, width / 2)
  return (
    <path
      d={`M${x+r},${y} h${width-2*r} a${r},${r} 0 0 1 ${r},${r} v${height-r} h-${width} v-${height-r} a${r},${r} 0 0 1 ${r},-${r}z`}
      fill={fill}
    />
  )
}

function CalTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid rgba(44,36,25,0.1)', borderRadius:12, padding:'0.6rem 0.9rem', boxShadow:'0 4px 16px rgba(44,36,25,0.1)', fontSize:'0.8rem', fontFamily:'var(--font-sans)' }}>
      <div style={{ fontWeight:600, color:'var(--color-bark)', marginBottom:2 }}>{label}</div>
      <div style={{ color:'var(--color-moss)' }}>{payload[0].value.toLocaleString()} kcal</div>
    </div>
  )
}

function MacroTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid rgba(44,36,25,0.1)', borderRadius:12, padding:'0.6rem 0.9rem', boxShadow:'0 4px 16px rgba(44,36,25,0.1)', fontSize:'0.8rem', fontFamily:'var(--font-sans)' }}>
      <div style={{ fontWeight:600, color:'var(--color-bark)', marginBottom:2 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}g</div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [range, setRange] = useState('week')
  const [meals, setMeals] = useState([])
  const [goals, setGoals] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    async function load() {
      if (!user.id) return
      try {
        const [m, g] = await Promise.all([
          getMeals(user.id),
          getGoals(user.id)
        ])
        setMeals(m || [])
        setGoals(g)
      } catch (err) {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  // Get last 7 days
  const last7 = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayMeals = meals.filter(m => m.date === dateStr)
    const kcal = dayMeals.reduce((s, m) => s + Number(m.calories || 0), 0)
    const protein = dayMeals.reduce((s, m) => s + Number(m.protein || 0), 0)
    const carbs = dayMeals.reduce((s, m) => s + Number(m.carbs || 0), 0)
    const fat = dayMeals.reduce((s, m) => s + Number(m.fat || 0), 0)
    last7.push({
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      kcal,
      protein,
      carbs,
      fat,
      date: dateStr
    })
  }

  const calorieGoal = goals?.dailyCalories || 2200
  const proteinGoal = goals?.protein || 140
  const carbsGoal = goals?.carbs || 250
  const fatGoal = goals?.fat || 55

  // Today's macros
  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.date === today)
  const todayTotals = todayMeals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein: acc.protein + Number(m.protein || 0),
    carbs: acc.carbs + Number(m.carbs || 0),
    fat: acc.fat + Number(m.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const macros = [
    { name: 'Protein', consumed: todayTotals.protein, goal: proteinGoal, color: 'var(--color-moss)', pct: Math.min(Math.round((todayTotals.protein / proteinGoal) * 100), 100) },
    { name: 'Carbs', consumed: todayTotals.carbs, goal: carbsGoal, color: '#d97706', pct: Math.min(Math.round((todayTotals.carbs / carbsGoal) * 100), 100) },
    { name: 'Fat', consumed: todayTotals.fat, goal: fatGoal, color: '#7c3aed', pct: Math.min(Math.round((todayTotals.fat / fatGoal) * 100), 100) },
  ]

  // Weekly summary stats
  const weekCalories = last7.reduce((s, d) => s + d.kcal, 0)
  const avgCalories = weekCalories > 0 ? Math.round(weekCalories / 7) : 0
  const daysOnGoal = last7.filter(d => d.kcal > 0 && d.kcal <= calorieGoal).length
  let streak = 0
  for (let i = last7.length - 1; i >= 0; i--) {
    if (last7[i].kcal > 0) streak++
    else break
  }

  const summary = [
    { value: avgCalories || '—', label: 'Avg Daily kcal' },
    { value: `${daysOnGoal}/7`, label: 'Days on Goal' },
    { value: streak, label: 'Day Streak' },
    { value: `${Math.min(Math.round((todayTotals.calories / calorieGoal) * 100), 100)}%`, label: 'Today\'s Goal' },
  ]

  if (loading) {
    return (
      <div className="an-page">
        <div className="an-inner">
          <div className="an-loading" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-warm-mid)' }}>Loading analytics…</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .an-page { min-height:100vh; padding-top:64px; background:var(--color-cream); }
        .dark .an-page { background:#0f0f0f; }
        .an-inner { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .an-h1 { font-family:var(--font-serif); font-size:clamp(1.6rem,3vw,2rem); font-weight:700; letter-spacing:-0.03em; color:var(--color-bark); margin-bottom:0.3rem; }
        .dark .an-h1 { color:#F5F0E8; }
        .an-sub { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); margin-bottom:1.75rem; }
        .an-tabs { display:flex; gap:0.4rem; margin-bottom:2rem; }
        .an-tab { padding:0.45rem 1.1rem; border-radius:100px; border:1px solid rgba(44,36,25,0.12); background:#fff; font-family:var(--font-sans); font-size:0.8rem; color:var(--color-warm-mid); cursor:pointer; transition:all 0.2s; }
        .dark .an-tab { background:#1a1a1a; border-color:rgba(255,255,255,0.1); color:#6b7280; }
        .an-tab.active { background:var(--color-bark); border-color:var(--color-bark); color:var(--color-cream); }
        .dark .an-tab.active { background:var(--color-moss); border-color:var(--color-moss); color:#fff; }
        .an-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; padding:1.5rem 1.5rem 1.25rem; box-shadow:0 2px 20px rgba(44,36,25,0.05); margin-bottom:1.25rem; }
        .dark .an-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
        .an-card-label { font-size:0.65rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.35rem; }
        .dark .an-card-label { color:#6b7280; }
        .an-card-title { font-family:var(--font-serif); font-size:1.1rem; font-weight:700; letter-spacing:-0.02em; color:var(--color-bark); margin-bottom:1.25rem; }
        .dark .an-card-title { color:#F5F0E8; }
        .an-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.25rem; }
        .an-goal-legend { display:flex; align-items:center; gap:0.4rem; font-size:0.7rem; color:#ef4444; margin-top:0.75rem; justify-content:flex-end; }
        .an-goal-dash { width:18px; height:2px; background:#ef4444; border-radius:2px; }
        .an-macro-row { margin-bottom:1.1rem; }
        .an-macro-row:last-child { margin-bottom:0; }
        .an-macro-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.5rem; }
        .an-macro-name { font-size:0.85rem; font-weight:500; color:var(--color-bark); }
        .dark .an-macro-name { color:#F5F0E8; }
        .an-macro-vals { font-size:0.75rem; color:var(--color-warm-mid); }
        .an-macro-track { height:8px; border-radius:100px; background:rgba(44,36,25,0.07); overflow:hidden; }
        .dark .an-macro-track { background:rgba(255,255,255,0.07); }
        .an-macro-fill { height:100%; border-radius:100px; transition:width 0.8s ease; }
        .an-summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .an-summary-item { background:var(--color-cream); border-radius:14px; padding:1rem 1.1rem; border:1px solid rgba(44,36,25,0.07); }
        .dark .an-summary-item { background:#252525; border-color:rgba(255,255,255,0.06); }
        .an-summary-val { font-family:var(--font-serif); font-size:1.6rem; font-weight:700; letter-spacing:-0.03em; color:var(--color-bark); line-height:1; margin-bottom:0.3rem; }
        .dark .an-summary-val { color:#F5F0E8; }
        .an-summary-label { font-size:0.7rem; color:var(--color-warm-mid); letter-spacing:0.02em; }
        .recharts-cartesian-axis-tick text { font-family:var(--font-sans) !important; font-size:11px !important; fill:var(--color-warm-mid) !important; }
        @media (max-width:768px) { .an-inner { padding:1.5rem 1rem 3rem; } .an-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="an-page">
        <div className="an-inner">

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="an-h1">Analytics</h1>
            <p className="an-sub">Track your progress and nutrition trends</p>
          </motion.div>

          <motion.div className="an-tabs" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.05 }}>
            {['week','month','year'].map(r => (
              <button key={r} className={`an-tab${range===r?' active':''}`} onClick={() => setRange(r)}>
                {r==='week'?'This Week':r==='month'?'This Month':'This Year'}
              </button>
            ))}
          </motion.div>

          {/* Calorie bar chart */}
          <motion.div className="an-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <div className="an-card-label">Daily intake</div>
            <div className="an-card-title">Calorie Intake — Last 7 Days</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7} barCategoryGap="30%" margin={{ top:4, right:4, left:-24, bottom:0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? '0' : `${(v/1000).toFixed(1)}k`} />
                <Tooltip content={<CalTooltip />} cursor={{ fill:'rgba(44,36,25,0.04)', radius:8 }} />
                <ReferenceLine y={calorieGoal} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" />
                <Bar dataKey="kcal" shape={<RoundedBar />}>
                  {last7.map((entry, i) => (
                    <Cell key={i} fill={entry.kcal > calorieGoal ? '#ef4444' : 'var(--color-moss)'} fillOpacity={entry.kcal===0 ? 0.2 : 0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="an-goal-legend">
              <div className="an-goal-dash" />
              Goal: {calorieGoal.toLocaleString()} kcal/day — red bars exceed goal
            </div>
          </motion.div>

          {/* Macros + macro bar chart */}
          <div className="an-grid">
            <motion.div className="an-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
              <div className="an-card-label">Today's breakdown</div>
              <div className="an-card-title">Macronutrients</div>
              {macros.map(({ name, consumed, goal, color, pct }) => (
                <div className="an-macro-row" key={name}>
                  <div className="an-macro-top">
                    <span className="an-macro-name">{name}</span>
                    <span className="an-macro-vals">{consumed}g / {goal}g</span>
                  </div>
                  <div className="an-macro-track">
                    <div className="an-macro-fill" style={{ width:`${pct}%`, background:color }} />
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div className="an-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
              <div className="an-card-label">7-day trend</div>
              <div className="an-card-title">Macro Breakdown</div>
              <ResponsiveContainer width="100%" height={178}>
                <BarChart data={last7} barCategoryGap="25%" margin={{ top:4, right:4, left:-28, bottom:0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(44,36,25,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<MacroTooltip />} />
                  <Bar dataKey="protein" name="Protein" stackId="a" fill="var(--color-moss)" radius={[0,0,0,0]} />
                  <Bar dataKey="carbs" name="Carbs" stackId="a" fill="#d97706" radius={[0,0,0,0]} />
                  <Bar dataKey="fat" name="Fat" stackId="a" fill="#7c3aed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', marginTop:'0.5rem', fontSize:'0.7rem', color:'var(--color-warm-mid)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'var(--color-moss)', display:'inline-block' }} />Protein</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#d97706', display:'inline-block' }} />Carbs</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:'#7c3aed', display:'inline-block' }} />Fat</span>
              </div>
            </motion.div>
          </div>

          {/* Weekly summary */}
          <motion.div className="an-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
            <div className="an-card-label">This week</div>
            <div className="an-card-title">Weekly Summary</div>
            <div className="an-summary-grid">
              {summary.map(({ value, label }) => (
                <div className="an-summary-item" key={label}>
                  <div className="an-summary-val">{value}</div>
                  <div className="an-summary-label">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}