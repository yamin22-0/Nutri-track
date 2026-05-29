import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMeals, getGoals, deleteMeal, getFoods } from '../api'
import toast from 'react-hot-toast'

const mealTabs = [
  { id: 'all',       label: 'All',       icon: '🍽️' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch',     label: 'Lunch',     icon: '🥗' },
  { id: 'dinner',    label: 'Dinner',    icon: '🍛' },
  { id: 'snack',     label: 'Snack',     icon: '🍎' },
]

// Decorative showcase foods (from db.json) shown when no meals logged
const SHOWCASE_FOODS = [
  { name: 'Chapati', calories: 300, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', category: 'Bread' },
  { name: 'Nyama Choma', calories: 350, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', category: 'Protein' },
  { name: 'Ugali', calories: 350, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop', category: 'Grain' },
  { name: 'Pilau', calories: 500, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', category: 'Rice' },
  { name: 'Sukuma Wiki', calories: 50, imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=300&fit=crop', category: 'Vegetable' },
  { name: 'Mandazi', calories: 250, imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop', category: 'Snack' },
]

export default function Dashboard() {
  const [user, setUser]               = useState(null)
  const [meals, setMeals]             = useState([])
  const [goals, setGoals]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeMealTab, setActiveMealTab] = useState('all')
  const [waterIntake, setWaterIntake] = useState(0)
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0])
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showFab, setShowFab]         = useState(false)

  const today     = new Date().toISOString().split('T')[0]
  const waterGoal = 2500
  const isToday   = selectedDay === today

  // Generate last 7 days for history picker
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { window.location.href = '/login'; return }
    const u = JSON.parse(stored)
    setUser(u)
    fetchData(u.id)
    const saved = localStorage.getItem(`water_${u.id}_${today}`)
    if (saved) setWaterIntake(parseInt(saved))
  }, [])

  useEffect(() => {
    if (user) fetchData(user.id)
  }, [selectedDay])

  const fetchData = useCallback(async (userId) => {
    try {
      setLoading(true)
      const [mealsData, goalsData] = await Promise.all([
        getMeals(userId),
        getGoals(userId),
      ])
      setMeals(mealsData || [])
      setGoals(goalsData || null)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [selectedDay])

  async function handleDeleteMeal(id) {
    try {
      await deleteMeal(id)
      setMeals(prev => prev.filter(m => m.id !== id))
      toast.success('Meal removed')
    } catch { toast.error('Failed to remove meal') }
  }

  function addWater(amount) {
    if (!isToday) return
    const next = Math.min(waterIntake + amount, waterGoal)
    setWaterIntake(next)
    localStorage.setItem(`water_${user?.id}_${today}`, next)
    if (next >= waterGoal) toast.success('🎉 Water goal reached!')
  }

  function resetWater() {
    setWaterIntake(0)
    localStorage.setItem(`water_${user?.id}_${today}`, 0)
  }

  // Derived
  const calorieGoal = goals?.dailyCalories || 2200
  const proteinGoal = goals?.protein       || 140
  const carbsGoal   = goals?.carbs         || 250
  const fatGoal     = goals?.fat           || 55

  const dayMeals = meals.filter(m => m.date === selectedDay)

  const totals = dayMeals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein:  acc.protein  + Number(m.protein  || 0),
    carbs:    acc.carbs    + Number(m.carbs    || 0),
    fat:      acc.fat      + Number(m.fat      || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const pct = (v, g) => Math.min(Math.round((v / g) * 100), 100)
  const caloriePct = pct(totals.calories, calorieGoal)
  const remaining  = Math.max(calorieGoal - totals.calories, 0)
  const waterPct   = Math.round((waterIntake / waterGoal) * 100)

  const ringC   = 2 * Math.PI * 80
  const ringOff = ringC * (1 - caloriePct / 100)

  const filteredMeals = activeMealTab === 'all'
    ? dayMeals
    : dayMeals.filter(m => m.mealType === activeMealTab)

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  function formatDay(dateStr) {
    if (dateStr === today) return 'Today'
    const d = new Date(dateStr + 'T12:00:00')
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', color:'var(--color-warm-mid)', fontSize:'0.9rem' }}>
      Loading your dashboard…
    </div>
  )

  return (
    <>
      <style>{css}</style>
      <div className="dc-wrap">

        {/* Header */}
        <motion.div className="dc-header" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
          <div>
            <h1 className="dc-greeting">{greeting}, <em>{firstName}</em></h1>
            <p className="dc-sub">
              {isToday
                ? `Here's your nutrition summary for today · ${new Date().toLocaleDateString('en', { weekday:'long', month:'long', day:'numeric' })}`
                : `Viewing meals for ${new Date(selectedDay + 'T12:00:00').toLocaleDateString('en', { weekday:'long', month:'long', day:'numeric' })}`
              }
            </p>
          </div>
          <div className="dc-header-actions">
            {/* Day history picker */}
            <div className="dc-day-picker-wrap">
              <button className="dc-day-btn" onClick={() => setShowDayPicker(p => !p)}>
                📅 {formatDay(selectedDay)} ▾
              </button>
              <AnimatePresence>
                {showDayPicker && (
                  <motion.div className="dc-day-dropdown"
                    initial={{ opacity:0, y:-8, scale:0.97 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:0.97 }}
                    transition={{ duration:0.15 }}
                  >
                    {last7Days.map(d => (
                      <button key={d} className={`dc-day-option ${selectedDay === d ? 'active' : ''}`}
                        onClick={() => { setSelectedDay(d); setShowDayPicker(false); setActiveMealTab('all') }}>
                        <span>{formatDay(d)}</span>
                        <span className="dc-day-count">{meals.filter(m => m.date === d).length} meals</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {isToday && (
              <button className="dc-log-btn" onClick={() => window.location.href='/food-log'}>+ Log Food</button>
            )}
          </div>
        </motion.div>

        {/* Top row: Ring + Macros */}
        <div className="dc-top">

          {/* Calorie Ring */}
          <motion.div className="dc-ring-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <div className="dc-ring-label-top">Daily Calories</div>
            <div className="dc-ring-wrap">
              <svg className="dc-ring-svg" width="180" height="180" viewBox="0 0 180 180">
                <circle className="dc-ring-bg" cx="90" cy="90" r="72" />
                <circle className="dc-ring-fill" cx="90" cy="90" r="72"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOff}
                  style={{ stroke: caloriePct >= 100 ? '#ef4444' : 'var(--color-moss)' }}
                />
              </svg>
              <div className="dc-ring-center">
                <span className="dc-ring-pct">{caloriePct}%</span>
                <span className="dc-ring-sub">of goal</span>
              </div>
            </div>
            <div className="dc-ring-stats">
              <div className="dc-ring-stat">
                <div className="dc-ring-stat-val">{totals.calories}</div>
                <div className="dc-ring-stat-label">Consumed</div>
              </div>
              <div className="dc-ring-stat-divider" />
              <div className="dc-ring-stat">
                <div className="dc-ring-stat-val" style={{ color: remaining === 0 ? '#ef4444' : 'var(--color-moss)' }}>
                  {remaining === 0 ? 'Done!' : remaining}
                </div>
                <div className="dc-ring-stat-label">Remaining</div>
              </div>
              <div className="dc-ring-stat-divider" />
              <div className="dc-ring-stat">
                <div className="dc-ring-stat-val">{calorieGoal}</div>
                <div className="dc-ring-stat-label">Goal</div>
              </div>
            </div>
          </motion.div>

          {/* Macro + Water cards */}
          <div className="dc-macros">
            {[
              { label:'Protein', val:`${totals.protein}g`,  goal:`${proteinGoal}g`, p:pct(totals.protein,proteinGoal), color:'#3b82f6' },
              { label:'Carbs',   val:`${totals.carbs}g`,    goal:`${carbsGoal}g`,   p:pct(totals.carbs,carbsGoal),     color:'#d97706' },
              { label:'Fat',     val:`${totals.fat}g`,      goal:`${fatGoal}g`,     p:pct(totals.fat,fatGoal),         color:'#8b5cf6' },
            ].map(({ label, val, goal, p, color }) => (
              <motion.div key={label} className="dc-macro-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                style={{ borderLeftColor: color }}>
                <div className="dc-macro-top">
                  <span className="dc-macro-label">{label}</span>
                  <span className="dc-macro-pct" style={{ color }}>{p}%</span>
                </div>
                <div className="dc-macro-val">{val}</div>
                <div className="dc-macro-goal">of {goal}</div>
                <div className="dc-macro-bar">
                  <div className="dc-macro-fill" style={{ width:`${p}%`, background:color }} />
                </div>
              </motion.div>
            ))}

            {/* Water card — only interactive on today */}
            <motion.div className="dc-macro-card dc-water-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ borderLeftColor:'#06b6d4' }}>
              <div className="dc-macro-top">
                <span className="dc-macro-label">💧 Water</span>
                <span className="dc-macro-pct" style={{ color:'#06b6d4' }}>{waterPct}%</span>
              </div>
              <div className="dc-macro-val">{waterIntake}<span style={{ fontSize:'0.8rem', fontWeight:400 }}>ml</span></div>
              <div className="dc-macro-goal">of {waterGoal}ml</div>
              <div className="dc-macro-bar">
                <div className="dc-macro-fill" style={{ width:`${waterPct}%`, background:'#06b6d4' }} />
              </div>
              {isToday && (
                <div className="dc-water-btns">
                  {[250,500].map(a => (
                    <button key={a} className="dc-water-btn" onClick={() => addWater(a)}>+{a}ml</button>
                  ))}
                  <button className="dc-water-reset" onClick={resetWater}>↺</button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Meals section */}
        <motion.div className="dc-meals-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <div className="dc-meals-header">
            <span className="dc-meals-title">
              {isToday ? "Today's Meals" : `Meals — ${formatDay(selectedDay)}`}
            </span>
            {isToday && (
              <button className="dc-add-meal-btn" onClick={() => window.location.href='/food-log'}>+ Add Meal</button>
            )}
          </div>

          {/* Tabs */}
          <div className="dc-meal-tabs">
            {mealTabs.map(t => (
              <button key={t.id} className={`dc-meal-tab ${activeMealTab===t.id?'active':''}`} onClick={() => setActiveMealTab(t.id)}>
                <span>{t.icon}</span><span>{t.label}</span>
                {t.id !== 'all' && (
                  <span className="dc-meal-tab-count">{dayMeals.filter(m=>m.mealType===t.id).length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Logged meals */}
          {filteredMeals.length > 0 ? filteredMeals.map(meal => (
            <motion.div key={meal.id} className="dc-meal-row" layout initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}>
              <div className="dc-meal-icon">
                {meal.mealType==='breakfast'?'🍳':meal.mealType==='lunch'?'🥗':meal.mealType==='dinner'?'🍛':'🍎'}
              </div>
              <div className="dc-meal-info">
                <div className="dc-meal-name">{meal.name}</div>
                <div className="dc-meal-macros">
                  <span>💪 {meal.protein}g</span>
                  <span>🍚 {meal.carbs}g</span>
                  <span>🥑 {meal.fat}g</span>
                  <span className="dc-meal-type-badge">{meal.mealType}</span>
                </div>
              </div>
              <div className="dc-meal-right">
                <span className="dc-meal-kcal">{meal.calories} kcal</span>
                {isToday && (
                  <button className="dc-meal-del" onClick={() => handleDeleteMeal(meal.id)}>✕</button>
                )}
              </div>
            </motion.div>
          )) : (
            <div>
              {/* Empty state with decorative food showcase */}
              <div className="dc-empty-header">
                <span className="dc-empty-text">
                  {activeMealTab === 'all'
                    ? (isToday ? 'No meals logged yet today' : 'No meals recorded for this day')
                    : `No ${activeMealTab} logged`}
                </span>
                {isToday && (
                  <button className="dc-add-meal-btn" onClick={() => window.location.href='/food-log'}>+ Add your first meal</button>
                )}
              </div>

              {/* Food showcase cards — decorative, not counted in totals */}
              <div className="dc-showcase-label">Popular Kenyan foods to try →</div>
              <div className="dc-showcase-grid">
                {SHOWCASE_FOODS.map(food => (
                  <div key={food.name} className="dc-showcase-card" onClick={() => window.location.href='/my-food-list'}>
                    <div className="dc-showcase-img" style={{ backgroundImage:`url(${food.imageUrl})` }} />
                    <div className="dc-showcase-body">
                      <div className="dc-showcase-name">{food.name}</div>
                      <div className="dc-showcase-cal">{food.calories} kcal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* When meals exist but tab is filtered, show showcase at bottom */}
          {dayMeals.length > 0 && filteredMeals.length === 0 && activeMealTab !== 'all' && (
            <div className="dc-empty">
              <div className="dc-empty-icon">🍽️</div>
              <div>No {activeMealTab} logged {isToday ? 'today' : 'on this day'}</div>
              {isToday && (
                <button className="dc-add-meal-btn" style={{ marginTop:'0.75rem' }} onClick={() => window.location.href='/food-log'}>
                  + Add {activeMealTab}
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div className="dc-quick" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
          {[
            { label:'Food Log',  icon:'🍽️', path:'/food-log'     },
            { label:'Analytics', icon:'📈', path:'/analytics'    },
            { label:'Goals',     icon:'🎯', path:'/goals'        },
            { label:'My Foods',  icon:'📋', path:'/my-food-list' },
          ].map(({ label, icon, path }) => (
            <button key={label} className="dc-quick-btn" onClick={() => window.location.href=path}>
              <span className="dc-quick-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

      </div>

      {/* Floating Action Button (today only) */}
      {isToday && (
        <div className="dc-fab-wrap">
          <AnimatePresence>
            {showFab && (
              <motion.div className="dc-fab-menu"
                initial={{ opacity:0, y:10, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:10, scale:0.95 }}
              >
                {[
                  { label:'Log Food', icon:'🍽️', path:'/food-log' },
                  { label:'My Foods', icon:'📋', path:'/my-food-list' },
                  { label:'Set Goals', icon:'🎯', path:'/goals' },
                ].map(({ label, icon, path }) => (
                  <button key={label} className="dc-fab-item" onClick={() => { window.location.href = path; setShowFab(false) }}>
                    <span>{icon}</span><span>{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className="dc-fab"
            onClick={() => setShowFab(p => !p)}
            animate={{ rotate: showFab ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            +
          </motion.button>
        </div>
      )}

      {/* Close day picker on outside click */}
      {showDayPicker && (
        <div style={{ position:'fixed', inset:0, zIndex:9 }} onClick={() => setShowDayPicker(false)} />
      )}
    </>
  )
}

const css = `
  .dc-wrap { padding:2rem 1.75rem 5rem; max-width:1100px; margin:0 auto; }
  @media(max-width:768px){ .dc-wrap{padding:1.25rem 1rem 5rem;} }

  /* Header */
  .dc-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:2rem; flex-wrap:wrap; }
  .dc-greeting { font-family:var(--font-serif); font-size:clamp(1.5rem,3vw,2rem); font-weight:700; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.25rem; }
  .dark .dc-greeting { color:#F5F0E8; }
  .dc-greeting em { color:var(--color-moss); font-style:italic; }
  .dark .dc-greeting em { color:var(--color-sage); }
  .dc-sub { font-size:0.825rem; font-weight:300; color:var(--color-warm-mid); }
  .dc-header-actions { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; }

  /* Day picker */
  .dc-day-picker-wrap { position:relative; z-index:10; }
  .dc-day-btn { padding:0.55rem 1.1rem; border-radius:100px; background:#fff; border:1.5px solid rgba(44,36,25,0.12); font-family:var(--font-sans); font-size:0.82rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.2s; white-space:nowrap; }
  .dc-day-btn:hover { border-color:var(--color-moss); color:var(--color-moss); }
  .dark .dc-day-btn { background:#1a1a1a; border-color:rgba(255,255,255,0.1); color:#D0CEC8; }
  .dc-day-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border:1px solid rgba(44,36,25,0.1); border-radius:16px; box-shadow:0 8px 32px rgba(44,36,25,0.12); overflow:hidden; min-width:200px; }
  .dark .dc-day-dropdown { background:#1e1e1e; border-color:rgba(255,255,255,0.08); }
  .dc-day-option { display:flex; justify-content:space-between; align-items:center; width:100%; padding:0.7rem 1.1rem; border:none; background:transparent; font-family:var(--font-sans); font-size:0.85rem; color:var(--color-bark); cursor:pointer; transition:background 0.15s; text-align:left; }
  .dc-day-option:hover { background:var(--color-sage-pale); }
  .dc-day-option.active { background:var(--color-sage-pale); color:var(--color-moss); font-weight:600; }
  .dark .dc-day-option { color:#D0CEC8; }
  .dark .dc-day-option:hover { background:rgba(255,255,255,0.04); }
  .dark .dc-day-option.active { background:rgba(59,109,17,0.15); color:var(--color-sage); }
  .dc-day-count { font-size:0.72rem; color:var(--color-warm-mid); background:rgba(44,36,25,0.06); padding:0.15rem 0.5rem; border-radius:100px; }
  .dark .dc-day-count { background:rgba(255,255,255,0.06); }

  .dc-log-btn { padding:0.65rem 1.4rem; border-radius:100px; background:var(--color-bark); color:var(--color-cream); border:none; font-family:var(--font-sans); font-size:0.875rem; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; white-space:nowrap; flex-shrink:0; }
  .dc-log-btn:hover { background:var(--color-moss); transform:translateY(-1px); }
  .dark .dc-log-btn { background:var(--color-moss); }

  /* Top row */
  .dc-top { display:grid; grid-template-columns:220px 1fr; gap:1.25rem; margin-bottom:1.25rem; align-items:start; }
  @media(max-width:900px){ .dc-top{grid-template-columns:1fr;} }

  /* Ring card */
  .dc-ring-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; padding:1.5rem 1.25rem; text-align:center; box-shadow:0 2px 12px rgba(44,36,25,0.04); }
  .dark .dc-ring-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .dc-ring-label-top { font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:1rem; }
  .dc-ring-wrap { position:relative; width:180px; height:180px; margin:0 auto 1rem; }
  .dc-ring-svg { transform:rotate(-90deg); }
  .dc-ring-bg { fill:none; stroke:rgba(44,36,25,0.07); stroke-width:12; }
  .dark .dc-ring-bg { stroke:rgba(255,255,255,0.07); }
  .dc-ring-fill { fill:none; stroke-width:12; stroke-linecap:round; transition:stroke-dashoffset 1s ease,stroke 0.3s; }
  .dc-ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .dc-ring-pct { font-family:var(--font-serif); font-size:2rem; font-weight:900; color:var(--color-bark); line-height:1; }
  .dark .dc-ring-pct { color:#F5F0E8; }
  .dc-ring-sub { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-warm-mid); margin-top:2px; }
  .dc-ring-stats { display:flex; justify-content:center; align-items:center; }
  .dc-ring-stat { flex:1; text-align:center; }
  .dc-ring-stat-divider { width:1px; height:24px; background:rgba(44,36,25,0.08); flex-shrink:0; }
  .dark .dc-ring-stat-divider { background:rgba(255,255,255,0.06); }
  .dc-ring-stat-val { font-family:var(--font-serif); font-size:0.95rem; font-weight:700; color:var(--color-bark); }
  .dark .dc-ring-stat-val { color:#F5F0E8; }
  .dc-ring-stat-label { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-warm-mid); margin-top:2px; }

  /* Macro cards grid */
  .dc-macros { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .dc-macro-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:16px; border-left:4px solid; padding:1rem 1.1rem; box-shadow:0 2px 8px rgba(44,36,25,0.04); }
  .dark .dc-macro-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); border-left-width:4px; }
  .dc-macro-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; }
  .dc-macro-label { font-size:0.68rem; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-warm-mid); }
  .dc-macro-pct { font-size:0.72rem; font-weight:600; }
  .dc-macro-val { font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--color-bark); line-height:1; }
  .dark .dc-macro-val { color:#F5F0E8; }
  .dc-macro-goal { font-size:0.7rem; color:var(--color-warm-mid); margin-top:0.15rem; margin-bottom:0.6rem; }
  .dc-macro-bar { height:5px; background:rgba(44,36,25,0.07); border-radius:5px; overflow:hidden; }
  .dark .dc-macro-bar { background:rgba(255,255,255,0.07); }
  .dc-macro-fill { height:100%; border-radius:5px; transition:width 0.8s ease; }
  .dc-water-btns { display:flex; gap:0.35rem; margin-top:0.75rem; }
  .dc-water-btn { flex:1; padding:0.3rem; border-radius:100px; border:1px solid rgba(44,36,25,0.1); background:transparent; font-size:0.68rem; cursor:pointer; transition:all 0.2s; color:var(--color-bark); }
  .dc-water-btn:hover { background:rgba(6,182,212,0.07); border-color:#06b6d4; color:#06b6d4; }
  .dark .dc-water-btn { border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .dc-water-reset { padding:0.3rem 0.5rem; border-radius:100px; border:1px solid rgba(44,36,25,0.1); background:transparent; font-size:0.75rem; cursor:pointer; color:var(--color-warm-mid); transition:all 0.2s; }
  .dc-water-reset:hover { background:rgba(239,68,68,0.07); border-color:#ef4444; color:#ef4444; }
  .dark .dc-water-reset { border-color:rgba(255,255,255,0.1); }

  /* Meals card */
  .dc-meals-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; overflow:hidden; box-shadow:0 2px 12px rgba(44,36,25,0.04); margin-bottom:1.25rem; }
  .dark .dc-meals-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .dc-meals-header { display:flex; align-items:center; justify-content:space-between; padding:1.1rem 1.5rem; border-bottom:1px solid rgba(44,36,25,0.07); }
  .dark .dc-meals-header { border-bottom-color:rgba(255,255,255,0.06); }
  .dc-meals-title { font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--color-bark); }
  .dark .dc-meals-title { color:#F5F0E8; }
  .dc-add-meal-btn { padding:0.4rem 1rem; border-radius:100px; background:var(--color-sage-pale); border:1px solid rgba(59,109,17,0.15); font-family:var(--font-sans); font-size:0.75rem; font-weight:500; color:var(--color-moss); cursor:pointer; transition:background 0.2s; }
  .dc-add-meal-btn:hover { background:var(--color-sage-light); }
  .dark .dc-add-meal-btn { background:rgba(59,109,17,0.12); border-color:rgba(151,196,89,0.2); color:var(--color-sage); }

  /* Tabs */
  .dc-meal-tabs { display:flex; gap:0.25rem; padding:0.75rem 1rem; border-bottom:1px solid rgba(44,36,25,0.06); overflow-x:auto; scrollbar-width:none; }
  .dc-meal-tabs::-webkit-scrollbar { display:none; }
  .dark .dc-meal-tabs { border-bottom-color:rgba(255,255,255,0.05); }
  .dc-meal-tab { display:flex; align-items:center; gap:0.35rem; padding:0.4rem 0.75rem; border-radius:100px; border:none; background:transparent; font-family:var(--font-sans); font-size:0.8rem; font-weight:500; color:var(--color-warm-mid); cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .dc-meal-tab:hover { background:rgba(44,36,25,0.05); color:var(--color-bark); }
  .dark .dc-meal-tab:hover { background:rgba(255,255,255,0.05); color:#F5F0E8; }
  .dc-meal-tab.active { background:var(--color-sage-pale); color:var(--color-moss); }
  .dark .dc-meal-tab.active { background:rgba(59,109,17,0.15); color:var(--color-sage); }
  .dc-meal-tab-count { background:rgba(44,36,25,0.08); border-radius:100px; padding:0 6px; font-size:0.65rem; }
  .dc-meal-tab.active .dc-meal-tab-count { background:rgba(59,109,17,0.15); }

  /* Meal rows */
  .dc-meal-row { display:flex; align-items:center; gap:1rem; padding:0.9rem 1.5rem; border-bottom:1px solid rgba(44,36,25,0.05); transition:background 0.15s; }
  .dc-meal-row:last-child { border-bottom:none; }
  .dc-meal-row:hover { background:var(--color-sage-pale); }
  .dark .dc-meal-row { border-bottom-color:rgba(255,255,255,0.04); }
  .dark .dc-meal-row:hover { background:rgba(255,255,255,0.025); }
  .dc-meal-icon { width:36px; height:36px; border-radius:10px; background:var(--color-cream); border:1px solid rgba(44,36,25,0.08); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
  .dark .dc-meal-icon { background:#252525; border-color:rgba(255,255,255,0.07); }
  .dc-meal-info { flex:1; min-width:0; }
  .dc-meal-name { font-size:0.875rem; font-weight:600; color:var(--color-bark); margin-bottom:0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dark .dc-meal-name { color:#F5F0E8; }
  .dc-meal-macros { display:flex; gap:0.6rem; font-size:0.7rem; color:var(--color-warm-mid); flex-wrap:wrap; align-items:center; }
  .dc-meal-type-badge { background:rgba(44,36,25,0.07); border-radius:100px; padding:0.1rem 0.5rem; font-size:0.62rem; text-transform:capitalize; }
  .dark .dc-meal-type-badge { background:rgba(255,255,255,0.07); }
  .dc-meal-right { display:flex; align-items:center; gap:0.75rem; flex-shrink:0; }
  .dc-meal-kcal { font-family:var(--font-serif); font-size:0.9rem; font-weight:700; color:var(--color-bark); white-space:nowrap; }
  .dark .dc-meal-kcal { color:#F5F0E8; }
  .dc-meal-del { width:26px; height:26px; border-radius:50%; background:transparent; border:1px solid rgba(44,36,25,0.1); display:flex; align-items:center; justify-content:center; font-size:0.7rem; color:var(--color-warm-mid); cursor:pointer; transition:all 0.15s; }
  .dc-meal-del:hover { background:rgba(239,68,68,0.08); border-color:#ef4444; color:#ef4444; }
  .dark .dc-meal-del { border-color:rgba(255,255,255,0.1); }

  /* Empty state + showcase */
  .dc-empty { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:3rem 2rem; text-align:center; color:var(--color-warm-mid); font-size:0.875rem; }
  .dc-empty-icon { font-size:2.5rem; opacity:0.4; }
  .dc-empty-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem 0.5rem; flex-wrap:wrap; gap:0.75rem; }
  .dc-empty-text { font-size:0.875rem; color:var(--color-warm-mid); }

  .dc-showcase-label { padding:0 1.5rem 0.5rem; font-size:0.7rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-warm-mid); }
  .dc-showcase-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:0.75rem; padding:0 1rem 1.25rem; }
  @media(max-width:900px){ .dc-showcase-grid{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:560px){ .dc-showcase-grid{grid-template-columns:repeat(2,1fr);} }
  .dc-showcase-card { border-radius:12px; overflow:hidden; border:1px solid rgba(44,36,25,0.08); cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; }
  .dc-showcase-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(44,36,25,0.1); }
  .dark .dc-showcase-card { border-color:rgba(255,255,255,0.06); }
  .dc-showcase-img { height:80px; background-size:cover; background-position:center; }
  .dc-showcase-body { padding:0.5rem 0.6rem; background:#fff; }
  .dark .dc-showcase-body { background:#1a1a1a; }
  .dc-showcase-name { font-size:0.72rem; font-weight:600; color:var(--color-bark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dark .dc-showcase-name { color:#F5F0E8; }
  .dc-showcase-cal { font-size:0.65rem; color:var(--color-warm-mid); margin-top:1px; }

  /* Quick actions */
  .dc-quick { display:grid; grid-template-columns:repeat(4,1fr); gap:0.75rem; }
  .dc-quick-btn { display:flex; align-items:center; gap:0.6rem; padding:0.9rem 1rem; border-radius:16px; background:#fff; border:1px solid rgba(44,36,25,0.09); font-family:var(--font-sans); font-size:0.85rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.2s; }
  .dc-quick-btn:hover { background:var(--color-sage-pale); border-color:rgba(59,109,17,0.2); transform:translateY(-2px); box-shadow:0 4px 12px rgba(44,36,25,0.07); }
  .dark .dc-quick-btn { background:#1a1a1a; border-color:rgba(255,255,255,0.07); color:#D0CEC8; }
  .dark .dc-quick-btn:hover { background:rgba(59,109,17,0.1); border-color:rgba(59,109,17,0.3); }
  .dc-quick-icon { font-size:1.2rem; }
  @media(max-width:640px){ .dc-quick{grid-template-columns:repeat(2,1fr);} }

  /* FAB */
  .dc-fab-wrap { position:fixed; bottom:2rem; right:2rem; display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem; z-index:100; }
  .dc-fab { width:52px; height:52px; border-radius:50%; background:var(--color-bark); border:none; color:#fff; font-size:1.6rem; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(44,36,25,0.25); transition:background 0.2s; }
  .dc-fab:hover { background:var(--color-moss); }
  .dark .dc-fab { background:var(--color-moss); }
  .dc-fab-menu { display:flex; flex-direction:column; gap:0.35rem; align-items:flex-end; }
  .dc-fab-item { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 1.1rem; border-radius:100px; border:none; background:#fff; box-shadow:0 2px 12px rgba(44,36,25,0.12); font-family:var(--font-sans); font-size:0.85rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .dc-fab-item:hover { background:var(--color-sage-pale); transform:translateX(-3px); }
  .dark .dc-fab-item { background:#1e1e1e; color:#F5F0E8; }
  .dark .dc-fab-item:hover { background:rgba(59,109,17,0.12); }
`