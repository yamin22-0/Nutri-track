import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getGoals, saveGoal } from '../api'
import toast from 'react-hot-toast'

function Goals() {
  const [goals, setGoals] = useState({
    dailyCalories: 2200,
    protein: 140,
    carbs: 250,
    fat: 55,
    water: 2500,
    targetWeight: 70,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [height, setHeight] = useState(170)
  const [weightLog, setWeightLog] = useState([])
  const [newWeight, setNewWeight] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    async function load() {
      if (!user.id) return
      try {
        const g = await getGoals(user.id)
        if (g) {
          setGoals({
            dailyCalories: g.dailyCalories || 2200,
            protein: g.protein || 140,
            carbs: g.carbs || 250,
            fat: g.fat || 55,
            water: g.water || 2500,
            targetWeight: g.targetWeight || 70,
          })
        }
        if (user.height) setHeight(Number(user.height))
        const storedWeightLog = localStorage.getItem(`weightLog_${user.id}`)
        if (storedWeightLog) setWeightLog(JSON.parse(storedWeightLog))
      } catch (err) {
        toast.error('Failed to load goals')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id, user.height])

  function handleChange(key, value) {
    setGoals(prev => ({ ...prev, [key]: parseInt(value) || 0 }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveGoal({ ...goals, userId: user.id })
      toast.success('Goals saved!')
    } catch (err) {
      toast.error('Failed to save goals')
    } finally {
      setSaving(false)
    }
  }

  function addWeight() {
    if (!newWeight) {
      toast.error('Enter a weight')
      return
    }
    const entry = { id: Date.now(), date: newDate, weight: parseFloat(newWeight) }
    const updated = [entry, ...weightLog].sort((a, b) => new Date(b.date) - new Date(a.date))
    setWeightLog(updated)
    localStorage.setItem(`weightLog_${user.id}`, JSON.stringify(updated))
    setNewWeight('')
    toast.success('Weight logged!')
  }

  function removeWeight(id) {
    const updated = weightLog.filter(e => e.id !== id)
    setWeightLog(updated)
    localStorage.setItem(`weightLog_${user.id}`, JSON.stringify(updated))
    toast.success('Weight entry removed')
  }

  const bmi = height > 0 ? (goals.targetWeight / ((height / 100) ** 2)).toFixed(1) : '—'
  let bmiStatus = ''
  let bmiColor = 'var(--color-moss)'
  if (bmi !== '—') {
    if (bmi < 18.5) { bmiStatus = 'Underweight'; bmiColor = '#3b82f6' }
    else if (bmi < 25) { bmiStatus = 'Normal weight'; bmiColor = 'var(--color-moss)' }
    else if (bmi < 30) { bmiStatus = 'Overweight'; bmiColor = '#d97706' }
    else { bmiStatus = 'Obese'; bmiColor = '#ef4444' }
  }

  const goalFields = [
    { key: 'dailyCalories', label: 'Daily Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'water', label: 'Water', unit: 'ml' },
  ]

  if (loading) {
    return (
      <div className="goals-page">
        <div className="goals-inner">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-warm-mid)' }}>Loading goals…</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .goals-page { min-height:100vh; padding-top:64px; background:var(--color-cream); }
        .dark .goals-page { background:#0f0f0f; }
        .goals-inner { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .goals-h1 { font-family:var(--font-serif); font-size:clamp(1.6rem,3vw,2rem); font-weight:700; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.3rem; }
        .dark .goals-h1 { color:#F5F0E8; }
        .goals-sub { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); margin-bottom:1.75rem; }
        .goals-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.25rem; }
        .goals-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; padding:1.5rem; box-shadow:0 2px 12px rgba(44,36,25,0.04); }
        .dark .goals-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
        .goals-card-title { font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--color-bark); margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem; }
        .dark .goals-card-title { color:#F5F0E8; }
        .goal-row { display:flex; align-items:center; justify-content:space-between; padding:0.7rem 0; border-bottom:1px solid rgba(44,36,25,0.07); }
        .goal-row:last-of-type { border-bottom:none; }
        .dark .goal-row { border-bottom-color:rgba(255,255,255,0.06); }
        .goal-label { font-size:0.875rem; color:var(--color-bark); display:flex; align-items:center; gap:0.5rem; }
        .dark .goal-label { color:#D0CEC8; }
        .goal-unit { font-size:0.7rem; color:var(--color-warm-mid); margin-left:2px; }
        .goal-input { width:90px; padding:0.4rem 0.7rem; border-radius:10px; border:1.5px solid rgba(44,36,25,0.12); background:var(--color-cream); text-align:right; font-size:0.875rem; color:var(--color-bark); outline:none; }
        .goal-input:focus { border-color:var(--color-moss); }
        .dark .goal-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
        .goals-save-btn { width:100%; margin-top:1.25rem; padding:0.875rem; background:var(--color-bark); color:var(--color-cream); border:none; border-radius:100px; font-size:0.9rem; font-weight:500; cursor:pointer; transition:background 0.2s; }
        .goals-save-btn:hover:not(:disabled) { background:var(--color-moss); }
        .goals-save-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .dark .goals-save-btn { background:var(--color-moss); }
        .bmi-display { text-align:center; padding:1.25rem 1rem; background:var(--color-sage-pale); border-radius:16px; margin:1rem 0; }
        .dark .bmi-display { background:rgba(59,109,17,0.1); }
        .bmi-value { font-size:2.8rem; font-weight:900; line-height:1; margin-bottom:0.3rem; }
        .bmi-status { font-size:0.8rem; color:var(--color-warm-mid); margin-top:0.25rem; }
        .bmi-scale { display:flex; gap:0.4rem; margin-top:1rem; }
        .bmi-seg { flex:1; height:5px; border-radius:100px; }
        .weight-list { max-height:200px; overflow-y:auto; margin-bottom:1rem; }
        .weight-item { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid rgba(44,36,25,0.06); }
        .dark .weight-item { border-bottom-color:rgba(255,255,255,0.05); }
        .weight-date { font-size:0.8rem; color:var(--color-warm-mid); }
        .weight-val { font-size:1rem; font-weight:700; color:var(--color-bark); }
        .dark .weight-val { color:#F5F0E8; }
        .weight-del { width:24px; height:24px; border-radius:50%; background:transparent; border:1px solid rgba(44,36,25,0.1); display:flex; align-items:center; justify-content:center; font-size:0.7rem; cursor:pointer; }
        .weight-del:hover { background:rgba(239,68,68,0.08); border-color:#ef4444; color:#ef4444; }
        .weight-add { display:flex; gap:0.5rem; align-items:center; }
        .weight-date-input, .weight-num-input { padding:0.55rem 0.75rem; border-radius:10px; border:1.5px solid rgba(44,36,25,0.12); background:#fff; font-size:0.8rem; color:var(--color-bark); outline:none; }
        .weight-date-input:focus, .weight-num-input:focus { border-color:var(--color-moss); }
        .dark .weight-date-input, .dark .weight-num-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
        .weight-date-input { flex:2; }
        .weight-num-input { flex:1; }
        .weight-add-btn { padding:0.55rem 1rem; border-radius:100px; background:var(--color-bark); color:var(--color-cream); border:none; font-size:0.8rem; font-weight:500; cursor:pointer; }
        .weight-add-btn:hover { background:var(--color-moss); }
        .dark .weight-add-btn { background:var(--color-moss); }
        @media (max-width:768px) { .goals-inner { padding:1.5rem 1rem 3rem; } }
      `}</style>

      <div className="goals-page">
        <div className="goals-inner">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="goals-h1">Goals & Progress</h1>
            <p className="goals-sub">Set your nutrition targets and track your journey</p>
          </motion.div>

          <div className="goals-grid">
            {/* Nutrition Goals */}
            <motion.div className="goals-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
              <div className="goals-card-title">🎯 Nutrition Goals</div>
              {goalFields.map(({ key, label, unit }) => (
                <div className="goal-row" key={key}>
                  <span className="goal-label">{label} <span className="goal-unit">{unit}</span></span>
                  <input type="number" className="goal-input" value={goals[key]} onChange={e => handleChange(key, e.target.value)} min="0" />
                </div>
              ))}
              <button className="goals-save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Goals'}</button>
            </motion.div>

            {/* BMI Calculator */}
            <motion.div className="goals-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
              <div className="goals-card-title">📊 BMI Calculator</div>
              <div className="goal-row">
                <span className="goal-label">Target Weight <span className="goal-unit">kg</span></span>
                <input type="number" className="goal-input" value={goals.targetWeight} onChange={e => handleChange('targetWeight', e.target.value)} min="0" />
              </div>
              <div className="goal-row">
                <span className="goal-label">Height <span className="goal-unit">cm</span></span>
                <input type="number" className="goal-input" value={height} onChange={e => setHeight(Number(e.target.value))} min="0" />
              </div>
              <div className="bmi-display">
                <div className="bmi-value" style={{ color: bmiColor }}>{bmi}</div>
                <div className="bmi-status">{bmiStatus}</div>
              </div>
              <div className="bmi-scale">
                <div className="bmi-seg" style={{ background: '#3b82f6' }} />
                <div className="bmi-seg" style={{ background: 'var(--color-moss)' }} />
                <div className="bmi-seg" style={{ background: '#d97706' }} />
                <div className="bmi-seg" style={{ background: '#ef4444' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.55rem', color:'var(--color-warm-mid)', marginTop:'0.5rem' }}>
                <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
              </div>
            </motion.div>

            {/* Weight Log */}
            <motion.div className="goals-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
              <div className="goals-card-title">⚖️ Weight Log</div>
              {weightLog.length > 0 ? (
                <div className="weight-list">
                  {weightLog.map(entry => (
                    <div key={entry.id} className="weight-item">
                      <span className="weight-date">{entry.date}</span>
                      <span className="weight-val">{entry.weight} kg</span>
                      <button className="weight-del" onClick={() => removeWeight(entry.id)}>✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:'1.5rem 0', textAlign:'center', color:'var(--color-warm-mid)', opacity:0.6 }}>No weight entries yet</div>
              )}
              <div className="weight-add">
                <input type="date" className="weight-date-input" value={newDate} onChange={e => setNewDate(e.target.value)} />
                <input type="number" className="weight-num-input" placeholder="kg" value={newWeight} onChange={e => setNewWeight(e.target.value)} min="0" step="0.1" />
                <button className="weight-add-btn" onClick={addWeight}>+ Log</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Goals