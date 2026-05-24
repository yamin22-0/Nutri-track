import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMeals, getGoals, deleteMeal } from '../api'
import toast from 'react-hot-toast'

const mealIcons = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍛',
  snack: '🍎',
}

function Dashboard() {
  const [user, setUser] = useState(null)
  const [meals, setMeals] = useState([])
  const [goals, setGoals] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { window.location.href = '/login'; return }
    const u = JSON.parse(stored)
    setUser(u)
    fetchData(u.id)
  }, [])

  async function fetchData(userId) {
    try {
      setLoading(true)
      const [mealsData, goalsData] = await Promise.all([
        getMeals(userId, today),
        getGoals(userId),
      ])
      setMeals(mealsData || [])
      setGoals(goalsData || null)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteMeal(id) {
    try {
      await deleteMeal(id)
      setMeals(prev => prev.filter(m => m.id !== id))
      toast.success('Meal removed')
    } catch {
      toast.error('Failed to remove meal')
    }
  }

  // Goals with fallbacks
  const calorieGoal = goals?.dailyCalories || 2200
  const proteinGoal = goals?.protein || 140
  const carbsGoal = goals?.carbs || 250
  const fatGoal = goals?.fat || 55

  // Totals
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein: acc.protein + Number(m.protein || 0),
    carbs: acc.carbs + Number(m.carbs || 0),
    fat: acc.fat + Number(m.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Percentages capped at 100
  const pct = (val, goal) => Math.min(Math.round((val / goal) * 100), 100)

  const caloriePct = pct(totals.calories, calorieGoal)
  const proteinPct = pct(totals.protein, proteinGoal)
  const carbsPct = pct(totals.carbs, carbsGoal)
  const fatPct = pct(totals.fat, fatGoal)

  // Status using only green/amber/gray (no blue/purple)
  function statusOf(p) {
    if (p < 50) return { color: '#94a3b8', label: 'Behind' }
    if (p < 80) return { color: '#f59e0b', label: 'Getting there' }
    if (p < 100) return { color: '#10b981', label: 'On track' }
    return { color: '#059669', label: 'Exceeded' }
  }

  const calorieStatus = statusOf(caloriePct)
  const proteinStatus = statusOf(proteinPct)
  const carbsStatus = statusOf(carbsPct)
  const fatStatus = statusOf(fatPct)

  const firstName = user?.name?.split(' ')[0] || 'there'
  const remaining = calorieGoal - totals.calories
  const ringC = 2 * Math.PI * 46
  const ringOff = ringC * (1 - caloriePct / 100)

  const macroCards = [
    { label: 'Calories', value: totals.calories, unit: 'kcal', goal: calorieGoal, pct: caloriePct, status: calorieStatus },
    { label: 'Protein', value: totals.protein, unit: 'g', goal: proteinGoal, pct: proteinPct, status: proteinStatus },
    { label: 'Carbs', value: totals.carbs, unit: 'g', goal: carbsGoal, pct: carbsPct, status: carbsStatus },
    { label: 'Fat', value: totals.fat, unit: 'g', goal: fatGoal, pct: fatPct, status: fatStatus },
  ]

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-inner">
          <div style={{ color: 'var(--color-warm-mid)', padding: '4rem 0', textAlign: 'center', fontSize: '0.9rem' }}>
            Loading your dashboard…
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .dash-page { min-height: 100vh; padding-top: 64px; background: var(--color-cream); }
        .dark .dash-page { background: #0f0f0f; }
        .dash-inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

        .dash-greeting { font-family: var(--font-serif); font-size: clamp(1.7rem,3vw,2.2rem); font-weight: 700; color: var(--color-bark); margin-bottom: 0.3rem; letter-spacing: -0.03em; }
        .dark .dash-greeting { color: #F5F0E8; }
        .dash-greeting em { color: var(--color-moss); font-style: italic; }
        .dark .dash-greeting em { color: var(--color-sage); }
        .dash-sub { color: var(--color-warm-mid); font-size: 0.9rem; font-weight: 300; margin-bottom: 2rem; }

        .dash-macros { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .dash-macro-card { background: #fff; border-radius: 18px; border: 1px solid rgba(44,36,25,0.08); padding: 1.25rem; box-shadow: 0 2px 12px rgba(44,36,25,0.04); }
        .dark .dash-macro-card { background: #1a1a1a; border-color: rgba(255,255,255,0.06); }
        .dash-macro-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
        .dash-macro-tag { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-warm-mid); font-weight: 500; }
        .dash-status-badge { font-size: 0.65rem; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 600; white-space: nowrap; }
        .dash-macro-val { font-size: 2rem; font-weight: 700; font-family: var(--font-serif); color: var(--color-bark); margin-bottom: 0.15rem; line-height: 1; letter-spacing: -0.03em; }
        .dark .dash-macro-val { color: #F5F0E8; }
        .dash-macro-sub { color: var(--color-warm-mid); font-size: 0.78rem; margin-bottom: 0.9rem; }
        .dash-bar-track { height: 6px; border-radius: 999px; background: rgba(44,36,25,0.08); overflow: hidden; }
        .dark .dash-bar-track { background: rgba(255,255,255,0.08); }
        .dash-bar-fill { height: 100%; border-radius: 999px; transition: width 0.8s ease; background: var(--color-moss); }

        .dash-body { display: grid; grid-template-columns: 1fr 330px; gap: 1.25rem; align-items: start; }
        .dash-card { background: #fff; border-radius: 18px; border: 1px solid rgba(44,36,25,0.08); padding: 1.5rem; box-shadow: 0 2px 12px rgba(44,36,25,0.04); }
        .dark .dash-card { background: #1a1a1a; border-color: rgba(255,255,255,0.06); }
        .dash-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .dash-card-title { font-size: 1.05rem; font-family: var(--font-serif); font-weight: 700; color: var(--color-bark); }
        .dark .dash-card-title { color: #F5F0E8; }
        .dash-add-btn { background: var(--color-sage-pale); border: 1px solid rgba(59,109,17,0.15); padding: 0.4rem 0.9rem; border-radius: 999px; cursor: pointer; font-size: 0.78rem; color: var(--color-moss); font-weight: 500; transition: background 0.2s; }
        .dash-add-btn:hover { background: var(--color-sage-light); }
        .dark .dash-add-btn { background: rgba(59,109,17,0.12); border-color: rgba(151,196,89,0.2); color: var(--color-sage); }

        .dash-meal-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0.9rem; border-radius: 12px; background: var(--color-cream); margin-bottom: 0.6rem; transition: background 0.15s; }
        .dash-meal-row:last-child { margin-bottom: 0; }
        .dash-meal-row:hover { background: var(--color-sage-pale); }
        .dark .dash-meal-row { background: #252525; }
        .dark .dash-meal-row:hover { background: #2e2e2e; }
        .dash-meal-left { display: flex; gap: 0.75rem; align-items: center; flex: 1; }
        .dash-meal-icon { width: 38px; height: 38px; border-radius: 10px; background: #fff; border: 1px solid rgba(44,36,25,0.08); display: flex; justify-content: center; align-items: center; font-size: 1.1rem; flex-shrink: 0; }
        .dark .dash-meal-icon { background: #1a1a1a; border-color: rgba(255,255,255,0.07); }
        .dash-meal-name { font-size: 0.875rem; font-weight: 600; color: var(--color-bark); margin-bottom: 0.1rem; }
        .dark .dash-meal-name { color: #F5F0E8; }
        .dash-meal-type { font-size: 0.72rem; color: var(--color-warm-mid); text-transform: capitalize; }
        .dash-meal-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .dash-meal-kcal { font-family: var(--font-serif); font-size: 0.9rem; font-weight: 700; color: var(--color-bark); white-space: nowrap; }
        .dark .dash-meal-kcal { color: #F5F0E8; }
        .dash-meal-del { width: 24px; height: 24px; border-radius: 50%; background: transparent; border: 1px solid rgba(44,36,25,0.12); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--color-warm-mid); cursor: pointer; transition: all 0.15s; }
        .dash-meal-del:hover { background: rgba(239,68,68,0.08); border-color: #ef4444; color: #ef4444; }
        .dark .dash-meal-del { border-color: rgba(255,255,255,0.1); }

        .dash-empty { text-align: center; padding: 2.5rem 1rem; color: var(--color-warm-mid); font-size: 0.875rem; }
        .dash-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.45; }

        .dash-sidebar { display: flex; flex-direction: column; gap: 1rem; }
        .dash-ring-wrap { position: relative; width: 110px; height: 110px; margin: 0 auto 1rem; }
        .dash-ring-svg { transform: rotate(-90deg); }
        .dash-ring-bg { fill: none; stroke: rgba(44,36,25,0.08); stroke-width: 8; }
        .dark .dash-ring-bg { stroke: rgba(255,255,255,0.08); }
        .dash-ring-fill { fill: none; stroke: var(--color-moss); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
        .dark .dash-ring-fill { stroke: var(--color-sage); }
        .dash-ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dash-ring-pct { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--color-bark); line-height: 1; }
        .dark .dash-ring-pct { color: #F5F0E8; }
        .dash-ring-sub { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-warm-mid); margin-top: 2px; }
        .dash-summary-ring { text-align: center; }
        .dash-summary-title { font-family: var(--font-serif); font-size: 1rem; font-weight: 700; color: var(--color-bark); margin-bottom: 0.25rem; }
        .dark .dash-summary-title { color: #F5F0E8; }
        .dash-summary-sub { color: var(--color-warm-mid); font-size: 0.82rem; line-height: 1.5; }

        .dash-actions { display: flex; flex-direction: column; gap: 0.65rem; }
        .dash-btn-primary { width: 100%; padding: 0.8rem; border-radius: 999px; border: none; background: var(--color-bark); color: var(--color-cream); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .dash-btn-primary:hover { background: var(--color-moss); transform: translateY(-1px); }
        .dark .dash-btn-primary { background: var(--color-moss); }
        .dark .dash-btn-primary:hover { background: var(--color-sage); color: #0f0f0f; }
        .dash-btn-ghost { width: 100%; padding: 0.8rem; border-radius: 999px; border: 1.5px solid rgba(44,36,25,0.15); background: transparent; color: var(--color-bark); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 400; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .dash-btn-ghost:hover { border-color: var(--color-bark); background: rgba(44,36,25,0.04); }
        .dark .dash-btn-ghost { color: #F5F0E8; border-color: rgba(255,255,255,0.15); }
        .dark .dash-btn-ghost:hover { border-color: var(--color-sage); background: rgba(151,196,89,0.07); }

        @media (max-width: 960px) {
          .dash-macros { grid-template-columns: repeat(2,1fr); }
          .dash-body { grid-template-columns: 1fr; }
          .dash-sidebar { flex-direction: row; flex-wrap: wrap; }
          .dash-sidebar > * { flex: 1 1 280px; }
        }
        @media (max-width: 540px) {
          .dash-inner { padding: 1.5rem 1rem 3rem; }
          .dash-macros { grid-template-columns: repeat(2,1fr); gap: 0.75rem; }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-inner">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h1 className="dash-greeting">Good morning, <em>{firstName}</em></h1>
            <p className="dash-sub">Track your daily nutrition and stay on goal</p>
          </motion.div>

          <motion.div className="dash-macros" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {macroCards.map(({ label, value, unit, goal, pct: p, status }) => (
              <div className="dash-macro-card" key={label}>
                <div className="dash-macro-top">
                  <span className="dash-macro-tag">{label}</span>
                  <span className="dash-status-badge" style={{ background: `${status.color}22`, color: status.color }}>{status.label}</span>
                </div>
                <div className="dash-macro-val">{value}<span style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>{unit}</span></div>
                <div className="dash-macro-sub">of {goal}{unit}</div>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{ width: `${p}%` }} />
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div className="dash-body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

            {/* Meals */}
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Today's Meals</span>
                <button className="dash-add-btn" onClick={() => window.location.href = '/food-log'}>+ Add Meal</button>
              </div>

              {meals.length > 0 ? meals.map(meal => (
                <div key={meal.id} className="dash-meal-row">
                  <div className="dash-meal-left">
                    <div className="dash-meal-icon">{mealIcons[meal.mealType] || '🍽️'}</div>
                    <div>
                      <div className="dash-meal-name">{meal.name}</div>
                      <div className="dash-meal-type">{meal.mealType}</div>
                    </div>
                  </div>
                  <div className="dash-meal-right">
                    <span className="dash-meal-kcal">{meal.calories} kcal</span>
                    <button className="dash-meal-del" onClick={() => handleDeleteMeal(meal.id)} title="Remove">✕</button>
                  </div>
                </div>
              )) : (
                <div className="dash-empty">
                  <div className="dash-empty-icon">🍽️</div>
                  <div>No meals logged today</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="dash-sidebar">

              {/* Calorie ring */}
              <div className="dash-card dash-summary-ring">
                <div className="dash-ring-wrap">
                  <svg className="dash-ring-svg" width="110" height="110">
                    <circle className="dash-ring-bg" cx="55" cy="55" r="46" />
                    <circle className="dash-ring-fill" cx="55" cy="55" r="46" strokeDasharray={ringC} strokeDashoffset={ringOff} />
                  </svg>
                  <div className="dash-ring-label">
                    <span className="dash-ring-pct">{caloriePct}%</span>
                    <span className="dash-ring-sub">of goal</span>
                  </div>
                </div>
                <div className="dash-summary-title">Daily Goal</div>
                <div className="dash-summary-sub">
                  {remaining > 0 ? `${remaining} kcal remaining` : '🎉 Goal reached!'}
                </div>
              </div>

              {/* Quick actions */}
              <div className="dash-card dash-actions">
                <div className="dash-card-header" style={{ marginBottom: '0.75rem' }}>
                  <span className="dash-card-title">Quick Actions</span>
                </div>
                <button className="dash-btn-primary" onClick={() => window.location.href = '/food-log'}>+ Log Food</button>
                <button className="dash-btn-ghost" onClick={() => window.location.href = '/analytics'}>View Analytics</button>
                <button className="dash-btn-ghost" onClick={() => window.location.href = '/goals'}>Set Goals</button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default Dashboard