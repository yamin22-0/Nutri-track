import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMeals, addMeal, deleteMeal, updateMeal, getFoods } from '../api'
import toast from 'react-hot-toast'

const mealCategories = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch',     label: 'Lunch',     icon: '🥗' },
  { id: 'dinner',    label: 'Dinner',    icon: '🍛' },
  { id: 'snack',     label: 'Snack',     icon: '🍎' },
]

const emptyForm = { name:'', calories:'', protein:'', carbs:'', fat:'' }

// Decorative food showcase from db.json — shown when no meals exist for the day
const SHOWCASE_FOODS = [
  { name: 'Ugali',           calories: 350, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=280&fit=crop', category: 'Grain' },
  { name: 'Nyama Choma',     calories: 350, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=280&fit=crop', category: 'Protein' },
  { name: 'Sukuma Wiki',     calories: 50,  imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=280&fit=crop', category: 'Vegetable' },
  { name: 'Chapati',         calories: 300, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=280&fit=crop', category: 'Bread' },
  { name: 'Maharagwe',       calories: 180, imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=280&fit=crop', category: 'Legume' },
  { name: 'Pilau',           calories: 500, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=280&fit=crop', category: 'Rice' },
  { name: 'Mandazi',         calories: 250, imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=280&fit=crop', category: 'Snack' },
  { name: 'Matoke',          calories: 220, imageUrl: 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=400&h=280&fit=crop', category: 'Main' },
  { name: 'Samaki wa Kupaka',calories: 420, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop', category: 'Protein' },
  { name: 'Kachumbari',      calories: 30,  imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop', category: 'Salad' },
  { name: 'Viazi Karai',     calories: 280, imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=280&fit=crop', category: 'Snack' },
  { name: 'Uji',             calories: 180, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop', category: 'Breakfast' },
]

export default function FoodLog() {
  const today = new Date().toISOString().split('T')[0]

  const [selectedDate, setSelectedDate] = useState(today)
  const [activeTab, setActiveTab]       = useState('breakfast')
  const [meals, setMeals]               = useState([])
  const [foods, setFoods]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Modal state
  const [showModal, setShowModal]       = useState(false)
  const [addMode, setAddMode]           = useState('search')
  const [search, setSearch]             = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [custom, setCustom]             = useState(emptyForm)
  const [saving, setSaving]             = useState(false)

  // Edit state
  const [editingMeal, setEditingMeal]   = useState(null)
  const [editForm, setEditForm]         = useState(emptyForm)
  const [editSaving, setEditSaving]     = useState(false)

  const user    = JSON.parse(localStorage.getItem('user') || '{}')
  const isToday = selectedDate === today

  // Generate last 14 days for history
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })

  function formatDay(dateStr) {
    if (dateStr === today) return 'Today'
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  function formatDayShort(dateStr) {
    if (dateStr === today) return 'Today'
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }

  useEffect(() => { loadMeals() }, [selectedDate])
  useEffect(() => { getFoods().then(setFoods).catch(() => {}) }, [])

  async function loadMeals() {
    setLoading(true)
    try {
      const data = await getMeals(user.id, selectedDate)
      setMeals(data || [])
    } catch { toast.error('Failed to load meals') }
    finally { setLoading(false) }
  }

  const currentMeals  = meals.filter(m => m.mealType === activeTab)
  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein:  acc.protein  + Number(m.protein  || 0),
    carbs:    acc.carbs    + Number(m.carbs    || 0),
    fat:      acc.fat      + Number(m.fat      || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // ── ADD ──────────────────────────────────────────
  async function handleAdd() {
    setSaving(true)
    try {
      let meal
      if (addMode === 'search') {
        if (!selectedFood) { toast.error('Select a food'); setSaving(false); return }
        meal = { userId: user.id, name: selectedFood.name, calories: selectedFood.calories, protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat, mealType: activeTab, date: selectedDate }
      } else {
        if (!custom.name) { toast.error('Enter a meal name'); setSaving(false); return }
        meal = { userId: user.id, name: custom.name, calories: Number(custom.calories) || 0, protein: Number(custom.protein) || 0, carbs: Number(custom.carbs) || 0, fat: Number(custom.fat) || 0, mealType: activeTab, date: selectedDate }
      }
      await addMeal(meal)
      await loadMeals()
      toast.success('Meal added!')
      closeModal()
    } catch { toast.error('Failed to add meal') }
    finally { setSaving(false) }
  }

  // ── DELETE ───────────────────────────────────────
  async function handleDelete(id) {
    try {
      await deleteMeal(id)
      setMeals(prev => prev.filter(m => m.id !== id))
      toast.success('Meal removed')
    } catch { toast.error('Failed to remove meal') }
  }

  // ── FULL UPDATE ──────────────────────────────────
  function openEdit(meal) {
    setEditingMeal(meal)
    setEditForm({ name: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat })
  }

  async function handleFullUpdate() {
    if (!editForm.name) { toast.error('Enter a meal name'); return }
    setEditSaving(true)
    try {
      const updated = await updateMeal(editingMeal.id, {
        name:     editForm.name,
        calories: Number(editForm.calories) || 0,
        protein:  Number(editForm.protein)  || 0,
        carbs:    Number(editForm.carbs)    || 0,
        fat:      Number(editForm.fat)      || 0,
      })
      setMeals(prev => prev.map(m => m.id === editingMeal.id ? { ...m, ...updated } : m))
      setEditingMeal(null)
      toast.success('Meal updated!')
    } catch { toast.error('Failed to update meal') }
    finally { setEditSaving(false) }
  }

  // ── PARTIAL UPDATE (quick calorie adjust) ────────
  async function handlePartialUpdate(meal, field, value) {
    try {
      const updated = await updateMeal(meal.id, { [field]: Number(value) || 0 })
      setMeals(prev => prev.map(m => m.id === meal.id ? { ...m, ...updated } : m))
      toast.success(`${field} updated!`)
    } catch { toast.error('Failed to update') }
  }

  function openModal() {
    setShowModal(true); setSearch(''); setSelectedFood(null)
    setCustom(emptyForm); setAddMode('search')
  }
  function closeModal() { setShowModal(false); setSearch(''); setSelectedFood(null) }

  const activeCat = mealCategories.find(c => c.id === activeTab)

  // Showcase filtered by active tab category (loosely)
  const tabShowcase = {
    breakfast: SHOWCASE_FOODS.filter(f => ['Breakfast','Bread','Grain'].includes(f.category)),
    lunch:     SHOWCASE_FOODS.filter(f => ['Grain','Protein','Vegetable','Salad','Main','Legume'].includes(f.category)),
    dinner:    SHOWCASE_FOODS.filter(f => ['Protein','Rice','Main','Grain','Legume'].includes(f.category)),
    snack:     SHOWCASE_FOODS.filter(f => ['Snack','Bread'].includes(f.category)),
  }
  const showcaseFoods = tabShowcase[activeTab] || SHOWCASE_FOODS

  return (
    <>
      <style>{css}</style>

      <div className="fl-wrap">

        {/* Header */}
        <motion.div className="fl-header" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
          <div>
            <h1 className="fl-title">Food Log</h1>
            <p className="fl-sub">
              {isToday ? 'Track every meal, every day' : `Viewing ${formatDay(selectedDate)}`}
            </p>
          </div>

          {/* Date controls */}
          <div className="fl-date-controls">
            {/* Quick day strip */}
            <div className="fl-day-strip">
              {last14Days.slice(0, 7).reverse().map(d => {
                const dayMealCount = meals.filter(m => m.date === d).length
                return (
                  <button key={d}
                    className={`fl-day-chip ${selectedDate === d ? 'active' : ''}`}
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className="fl-day-chip-label">{formatDayShort(d)}</span>
                    {dayMealCount > 0 && <span className="fl-day-chip-dot" />}
                  </button>
                )
              })}
              {/* Full history button */}
              <div className="fl-datebar">
                <span className="fl-date-label">📅</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="fl-date-input"
                  max={today}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div className="fl-summary" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          {[
            { label:'Calories', value: totals.calories,        color:'var(--color-moss)' },
            { label:'Protein',  value: `${totals.protein}g`,   color:'#3b82f6' },
            { label:'Carbs',    value: `${totals.carbs}g`,     color:'#d97706' },
            { label:'Fat',      value: `${totals.fat}g`,       color:'#8b5cf6' },
          ].map(({ label, value, color }) => (
            <div className="fl-sum-card" key={label}>
              <div className="fl-sum-val" style={{ color }}>{value}</div>
              <div className="fl-sum-label">{label}</div>
              <div className="fl-sum-bar" style={{ background: color }} />
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div className="fl-tabs" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          {mealCategories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`fl-tab ${activeTab === cat.id ? 'active' : ''}`}>
              <span>{cat.icon}</span><span>{cat.label}</span>
              <span className="fl-tab-count">{meals.filter(m => m.mealType === cat.id).length}</span>
            </button>
          ))}
        </motion.div>

        {/* Meals card */}
        <motion.div className="fl-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <div className="fl-card-header">
            <div className="fl-card-title"><span>{activeCat?.icon}</span><span>{activeCat?.label}</span></div>
            {isToday && (
              <button className="fl-add-btn" onClick={openModal}>+ Add Item</button>
            )}
          </div>

          {loading ? (
            <div className="fl-loading">Loading meals…</div>
          ) : currentMeals.length > 0 ? (
            <>
              {currentMeals.map(meal => (
                <motion.div key={meal.id} className="fl-meal" layout initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}>
                  <div className="fl-meal-info">
                    <div className="fl-meal-name">{meal.name}</div>
                    <div className="fl-meal-macros">
                      <span>💪 {meal.protein}g</span>
                      <span>🍚 {meal.carbs}g</span>
                      <span>🥑 {meal.fat}g</span>
                    </div>
                  </div>
                  <div className="fl-meal-right">
                    <span className="fl-meal-kcal">{meal.calories} kcal</span>
                    {isToday && (
                      <>
                        <button className="fl-meal-edit" onClick={() => openEdit(meal)} title="Edit">✏️</button>
                        <button className="fl-meal-del" onClick={() => handleDelete(meal.id)} title="Delete">✕</button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            /* Empty state with food showcase */
            <div className="fl-empty-wrap">
              <div className="fl-empty-top">
                <div className="fl-empty-icon">{activeCat?.icon}</div>
                <div className="fl-empty-msg">
                  {isToday
                    ? `No ${activeCat?.label.toLowerCase()} logged yet`
                    : `No ${activeCat?.label.toLowerCase()} on ${formatDay(selectedDate)}`}
                </div>
                {isToday && (
                  <button className="fl-add-btn fl-add-btn-center" onClick={openModal}>
                    + Add {activeCat?.label}
                  </button>
                )}
              </div>

              {/* Decorative food cards */}
              <div className="fl-showcase-label">
                {isToday ? 'Popular options to add →' : 'Browse & add for today →'}
              </div>
              <div className="fl-showcase-grid">
                {showcaseFoods.slice(0, 6).map(food => (
                  <div key={food.name} className="fl-showcase-card"
                    onClick={() => {
                      if (!isToday) { setSelectedDate(today); setTimeout(openModal, 100) }
                      else openModal()
                    }}
                  >
                    <div className="fl-showcase-img" style={{ backgroundImage:`url(${food.imageUrl})` }}>
                      <div className="fl-showcase-overlay">
                        <span className="fl-showcase-add">+ Add</span>
                      </div>
                    </div>
                    <div className="fl-showcase-body">
                      <div className="fl-showcase-name">{food.name}</div>
                      <div className="fl-showcase-meta">
                        <span className="fl-showcase-cal">{food.calories} kcal</span>
                        <span className="fl-showcase-cat">{food.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Past day notice */}
        {!isToday && (
          <motion.div className="fl-past-notice" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
            <span>📅 Viewing past date — </span>
            <button className="fl-past-today-btn" onClick={() => setSelectedDate(today)}>Back to today</button>
          </motion.div>
        )}

      </div>

      {/* ── ADD MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fl-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <motion.div className="fl-modal"
              initial={{ opacity:0, scale:0.95, y:16 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:16 }}
              transition={{ duration:0.2 }}
            >
              <div className="fl-modal-title">Add to {activeCat?.label}</div>

              <div className="fl-mode-toggle">
                <button className={`fl-mode-btn ${addMode==='search' ? 'active' : ''}`} onClick={() => setAddMode('search')}>Search Foods</button>
                <button className={`fl-mode-btn ${addMode==='custom' ? 'active' : ''}`} onClick={() => setAddMode('custom')}>Custom Entry</button>
              </div>

              {addMode === 'search' ? (
                <>
                  <input className="fl-modal-input" placeholder="Search food database…" value={search}
                    onChange={e => setSearch(e.target.value)} autoFocus />
                  <div className="fl-food-list">
                    {filteredFoods.length > 0 ? filteredFoods.map(food => (
                      <div key={food.id} className={`fl-food-item ${selectedFood?.id === food.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFood(food)}>
                        <div>
                          <div className="fl-food-name">{food.name}</div>
                          <div className="fl-food-meta">{food.protein}g P · {food.carbs}g C · {food.fat}g F</div>
                        </div>
                        <div className="fl-food-kcal">{food.calories} kcal</div>
                      </div>
                    )) : <div className="fl-food-empty">No foods found</div>}
                  </div>
                  {selectedFood && (
                    <div className="fl-selected-banner">✓ {selectedFood.name} — {selectedFood.calories} kcal</div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ marginBottom:'0.6rem' }}>
                    <div className="fl-custom-label">Meal Name</div>
                    <input className="fl-modal-input" style={{ marginBottom:0 }} placeholder="e.g. Rice and Beans"
                      value={custom.name} onChange={e => setCustom(p => ({ ...p, name: e.target.value }))} autoFocus />
                  </div>
                  <div className="fl-custom-grid">
                    {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([key, label]) => (
                      <div key={key}>
                        <div className="fl-custom-label">{label}</div>
                        <input className="fl-modal-input" style={{ marginBottom:0 }} type="number" min="0" placeholder="0"
                          value={custom[key]} onChange={e => setCustom(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="fl-modal-actions">
                <button className="fl-modal-confirm" onClick={handleAdd} disabled={saving}>
                  {saving ? 'Adding…' : 'Add Meal'}
                </button>
                <button className="fl-modal-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editingMeal && (
          <div className="fl-overlay" onClick={e => e.target === e.currentTarget && setEditingMeal(null)}>
            <motion.div className="fl-modal"
              initial={{ opacity:0, scale:0.95, y:16 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:16 }}
              transition={{ duration:0.2 }}
            >
              <div className="fl-modal-title">Edit Meal</div>

              <div style={{ marginBottom:'0.6rem' }}>
                <div className="fl-custom-label">Meal Name</div>
                <input className="fl-modal-input" style={{ marginBottom:0 }}
                  value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} autoFocus />
              </div>

              <div className="fl-custom-grid">
                {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([key, label]) => (
                  <div key={key}>
                    <div className="fl-custom-label">{label}</div>
                    <input className="fl-modal-input" style={{ marginBottom:0 }} type="number" min="0"
                      value={editForm[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>

              {/* Quick calorie adjust */}
              <div className="fl-partial-section">
                <div className="fl-custom-label" style={{ marginBottom:'0.5rem' }}>Quick Calorie Adjust</div>
                <div className="fl-partial-btns">
                  {[-100, -50, +50, +100].map(delta => (
                    <button key={delta} className="fl-partial-btn"
                      onClick={() => {
                        const newCal = Math.max(0, Number(editForm.calories) + delta)
                        setEditForm(p => ({ ...p, calories: newCal }))
                        handlePartialUpdate(editingMeal, 'calories', newCal)
                      }}>
                      {delta > 0 ? `+${delta}` : delta} kcal
                    </button>
                  ))}
                </div>
              </div>

              <div className="fl-modal-actions">
                <button className="fl-modal-confirm" onClick={handleFullUpdate} disabled={editSaving}>
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button className="fl-modal-cancel" onClick={() => setEditingMeal(null)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Close date picker on outside click */}
      {showDatePicker && (
        <div style={{ position:'fixed', inset:0, zIndex:9 }} onClick={() => setShowDatePicker(false)} />
      )}
    </>
  )
}

const css = `
  .fl-wrap { padding:2rem 1.75rem 4rem; max-width:1100px; margin:0 auto; }
  @media(max-width:768px){ .fl-wrap{padding:1.25rem 1rem 3rem;} }

  /* Header */
  .fl-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1.25rem; margin-bottom:1.75rem; flex-wrap:wrap; }
  .fl-title { font-family:var(--font-serif); font-size:clamp(1.6rem,3vw,2rem); font-weight:700; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.3rem; }
  .dark .fl-title { color:#F5F0E8; }
  .fl-sub { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); }

  /* Date controls */
  .fl-date-controls { display:flex; flex-direction:column; align-items:flex-end; gap:0.6rem; }
  .fl-day-strip { display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; justify-content:flex-end; }

  /* Day chips */
  .fl-day-chip { position:relative; padding:0.4rem 0.75rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.1); background:#fff; font-family:var(--font-sans); font-size:0.75rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .fl-day-chip:hover { border-color:var(--color-moss); color:var(--color-moss); }
  .fl-day-chip.active { background:var(--color-bark); border-color:var(--color-bark); color:var(--color-cream); }
  .dark .fl-day-chip { background:#1a1a1a; border-color:rgba(255,255,255,0.09); color:#94a3b8; }
  .dark .fl-day-chip.active { background:var(--color-moss); border-color:var(--color-moss); color:#fff; }
  .fl-day-chip-label { display:block; }
  .fl-day-chip-dot { position:absolute; top:4px; right:4px; width:5px; height:5px; border-radius:50%; background:var(--color-moss); }
  .fl-day-chip.active .fl-day-chip-dot { background:var(--color-cream); }

  /* Date input */
  .fl-datebar { display:flex; align-items:center; gap:0.5rem; background:#fff; border:1.5px solid rgba(44,36,25,0.1); border-radius:100px; padding:0.35rem 0.85rem; }
  .dark .fl-datebar { background:#1a1a1a; border-color:rgba(255,255,255,0.08); }
  .fl-date-label { font-size:0.85rem; }
  .fl-date-input { border:none; background:transparent; color:var(--color-bark); font-family:var(--font-sans); font-size:0.78rem; outline:none; cursor:pointer; }
  .dark .fl-date-input { color:#D0CEC8; }
  @media(max-width:768px){
    .fl-day-strip { display:none; }
    .fl-datebar { border-radius:12px; padding:0.5rem 1rem; }
    .fl-date-input { font-size:0.85rem; }
  }

  /* Summary */
  .fl-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
  .fl-sum-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:16px; padding:1.1rem 1rem; text-align:center; box-shadow:0 2px 8px rgba(44,36,25,0.04); transition:transform 0.2s; }
  .fl-sum-card:hover { transform:translateY(-2px); }
  .dark .fl-sum-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .fl-sum-val { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; letter-spacing:-0.03em; line-height:1; }
  .fl-sum-label { font-size:0.68rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-warm-mid); margin-top:0.3rem; }
  .fl-sum-bar { height:3px; border-radius:100px; margin-top:0.75rem; opacity:0.5; }

  /* Tabs */
  .fl-tabs { display:flex; gap:0.5rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .fl-tab { display:flex; align-items:center; gap:0.4rem; padding:0.55rem 1rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.1); background:#fff; font-family:var(--font-sans); font-size:0.85rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.18s; }
  .dark .fl-tab { background:#1a1a1a; border-color:rgba(255,255,255,0.08); color:#94a3b8; }
  .fl-tab:hover { border-color:var(--color-moss); color:var(--color-moss); }
  .fl-tab.active { background:var(--color-bark); border-color:var(--color-bark); color:var(--color-cream); }
  .dark .fl-tab.active { background:var(--color-moss); border-color:var(--color-moss); color:#fff; }
  .fl-tab-count { background:rgba(44,36,25,0.08); border-radius:100px; padding:0.1rem 6px; font-size:0.65rem; }
  .fl-tab.active .fl-tab-count { background:rgba(255,255,255,0.2); }

  /* Card */
  .fl-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; overflow:hidden; box-shadow:0 2px 16px rgba(44,36,25,0.05); }
  .dark .fl-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .fl-card-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; border-bottom:1px solid rgba(44,36,25,0.07); background:rgba(44,36,25,0.015); }
  .dark .fl-card-header { background:rgba(255,255,255,0.015); border-bottom-color:rgba(255,255,255,0.06); }
  .fl-card-title { display:flex; align-items:center; gap:0.5rem; font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--color-bark); }
  .dark .fl-card-title { color:#F5F0E8; }
  .fl-add-btn { padding:0.4rem 1rem; border-radius:100px; background:var(--color-sage-pale); border:1px solid rgba(59,109,17,0.15); font-family:var(--font-sans); font-size:0.75rem; font-weight:500; color:var(--color-moss); cursor:pointer; transition:background 0.2s; }
  .fl-add-btn:hover { background:var(--color-sage-light); }
  .dark .fl-add-btn { background:rgba(59,109,17,0.12); border-color:rgba(151,196,89,0.2); color:var(--color-sage); }
  .fl-add-btn-center { margin-top:0.25rem; }

  /* Meal rows */
  .fl-meal { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; border-bottom:1px solid rgba(44,36,25,0.06); transition:background 0.15s; }
  .fl-meal:last-child { border-bottom:none; }
  .fl-meal:hover { background:var(--color-sage-pale); }
  .dark .fl-meal { border-bottom-color:rgba(255,255,255,0.05); }
  .dark .fl-meal:hover { background:rgba(255,255,255,0.025); }
  .fl-meal-info { flex:1; }
  .fl-meal-name { font-size:0.9rem; font-weight:600; color:var(--color-bark); margin-bottom:0.25rem; }
  .dark .fl-meal-name { color:#F5F0E8; }
  .fl-meal-macros { display:flex; gap:0.6rem; font-size:0.72rem; color:var(--color-warm-mid); flex-wrap:wrap; }
  .fl-meal-right { display:flex; align-items:center; gap:0.6rem; }
  .fl-meal-kcal { font-family:var(--font-serif); font-size:0.9rem; font-weight:700; color:var(--color-bark); white-space:nowrap; }
  .dark .fl-meal-kcal { color:#F5F0E8; }
  .fl-meal-edit { width:28px; height:28px; border-radius:50%; background:transparent; border:1px solid rgba(44,36,25,0.1); display:flex; align-items:center; justify-content:center; font-size:0.75rem; cursor:pointer; transition:all 0.15s; }
  .fl-meal-edit:hover { background:var(--color-sage-pale); border-color:var(--color-moss); }
  .dark .fl-meal-edit { border-color:rgba(255,255,255,0.1); }
  .fl-meal-del { width:28px; height:28px; border-radius:50%; background:transparent; border:1px solid rgba(44,36,25,0.1); display:flex; align-items:center; justify-content:center; font-size:0.72rem; color:var(--color-warm-mid); cursor:pointer; transition:all 0.15s; }
  .fl-meal-del:hover { background:rgba(239,68,68,0.08); border-color:#ef4444; color:#ef4444; }
  .dark .fl-meal-del { border-color:rgba(255,255,255,0.1); }

  /* Empty + showcase */
  .fl-empty-wrap { padding-bottom:1.25rem; }
  .fl-empty-top { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2rem 2rem 1rem; text-align:center; }
  .fl-empty-icon { font-size:2.2rem; opacity:0.35; }
  .fl-empty-msg { font-size:0.875rem; color:var(--color-warm-mid); }

  .fl-showcase-label { padding:0 1.5rem 0.6rem; font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-warm-mid); }
  .fl-showcase-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; padding:0 1rem 0.5rem; }
  @media(max-width:680px){ .fl-showcase-grid{grid-template-columns:repeat(2,1fr);} }
  .fl-showcase-card { border-radius:12px; overflow:hidden; border:1px solid rgba(44,36,25,0.08); cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; }
  .fl-showcase-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(44,36,25,0.1); }
  .dark .fl-showcase-card { border-color:rgba(255,255,255,0.07); }
  .fl-showcase-img { height:100px; background-size:cover; background-position:center; position:relative; overflow:hidden; }
  .fl-showcase-overlay { position:absolute; inset:0; background:rgba(44,36,25,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; }
  .fl-showcase-card:hover .fl-showcase-overlay { opacity:1; }
  .fl-showcase-add { color:#fff; font-size:0.82rem; font-weight:600; letter-spacing:0.04em; background:var(--color-moss); padding:0.35rem 0.9rem; border-radius:100px; }
  .fl-showcase-body { padding:0.6rem 0.75rem; background:#fff; }
  .dark .fl-showcase-body { background:#1a1a1a; }
  .fl-showcase-name { font-size:0.8rem; font-weight:600; color:var(--color-bark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:0.25rem; }
  .dark .fl-showcase-name { color:#F5F0E8; }
  .fl-showcase-meta { display:flex; align-items:center; justify-content:space-between; }
  .fl-showcase-cal { font-size:0.7rem; font-weight:600; color:var(--color-moss); }
  .dark .fl-showcase-cal { color:var(--color-sage); }
  .fl-showcase-cat { font-size:0.62rem; color:var(--color-warm-mid); background:rgba(44,36,25,0.06); padding:0.1rem 0.45rem; border-radius:100px; }
  .dark .fl-showcase-cat { background:rgba(255,255,255,0.06); }

  /* Past date notice */
  .fl-past-notice { margin-top:1rem; text-align:center; font-size:0.82rem; color:var(--color-warm-mid); padding:0.75rem; background:rgba(44,36,25,0.03); border-radius:12px; }
  .dark .fl-past-notice { background:rgba(255,255,255,0.03); }
  .fl-past-today-btn { border:none; background:none; color:var(--color-moss); font-family:var(--font-sans); font-size:0.82rem; font-weight:600; cursor:pointer; text-decoration:underline; }
  .dark .fl-past-today-btn { color:var(--color-sage); }

  .fl-loading { text-align:center; padding:3rem; color:var(--color-warm-mid); font-size:0.875rem; }

  /* Modal */
  .fl-overlay { position:fixed; inset:0; background:rgba(44,36,25,0.55); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:200; padding:1rem; }
  .fl-modal { background:var(--color-cream); border-radius:24px; padding:2rem; width:100%; max-width:460px; box-shadow:0 24px 64px rgba(44,36,25,0.18); max-height:90vh; overflow-y:auto; }
  .dark .fl-modal { background:#1a1a1a; }
  .fl-modal-title { font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--color-bark); letter-spacing:-0.02em; margin-bottom:1.25rem; }
  .dark .fl-modal-title { color:#F5F0E8; }

  .fl-mode-toggle { display:flex; background:rgba(44,36,25,0.06); border-radius:100px; padding:3px; margin-bottom:1.25rem; }
  .dark .fl-mode-toggle { background:rgba(255,255,255,0.06); }
  .fl-mode-btn { flex:1; padding:0.45rem; border-radius:100px; border:none; background:transparent; font-family:var(--font-sans); font-size:0.8rem; font-weight:500; color:var(--color-warm-mid); cursor:pointer; transition:all 0.18s; }
  .fl-mode-btn.active { background:#fff; color:var(--color-bark); box-shadow:0 1px 6px rgba(44,36,25,0.1); }
  .dark .fl-mode-btn.active { background:#2a2a2a; color:#F5F0E8; }

  .fl-modal-input { width:100%; padding:0.8rem 1rem; border-radius:12px; border:1.5px solid rgba(44,36,25,0.12); background:#fff; color:var(--color-bark); font-family:var(--font-sans); font-size:0.9rem; outline:none; margin-bottom:0.75rem; transition:border-color 0.2s, box-shadow 0.2s; box-sizing:border-box; }
  .fl-modal-input:focus { border-color:var(--color-moss); box-shadow:0 0 0 3px rgba(59,109,17,0.1); }
  .dark .fl-modal-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .dark .fl-modal-input::placeholder { color:rgba(255,255,255,0.25); }

  .fl-food-list { max-height:200px; overflow-y:auto; border:1px solid rgba(44,36,25,0.09); border-radius:12px; margin-bottom:0.75rem; }
  .dark .fl-food-list { border-color:rgba(255,255,255,0.07); }
  .fl-food-item { display:flex; align-items:center; justify-content:space-between; padding:0.65rem 1rem; cursor:pointer; border-bottom:1px solid rgba(44,36,25,0.05); transition:background 0.15s; }
  .fl-food-item:last-child { border-bottom:none; }
  .fl-food-item:hover { background:var(--color-sage-pale); }
  .dark .fl-food-item:hover { background:rgba(255,255,255,0.04); }
  .fl-food-item.selected { background:var(--color-sage-pale); border-left:3px solid var(--color-moss); }
  .dark .fl-food-item.selected { background:rgba(59,109,17,0.12); border-left-color:var(--color-sage); }
  .fl-food-name { font-size:0.85rem; font-weight:500; color:var(--color-bark); }
  .dark .fl-food-name { color:#F5F0E8; }
  .fl-food-meta { font-size:0.7rem; color:var(--color-warm-mid); }
  .fl-food-kcal { font-size:0.8rem; font-weight:600; color:var(--color-moss); white-space:nowrap; }
  .dark .fl-food-kcal { color:var(--color-sage); }
  .fl-food-empty { padding:1.5rem; text-align:center; color:var(--color-warm-mid); font-size:0.875rem; }

  .fl-selected-banner { padding:0.7rem 1rem; background:var(--color-sage-pale); border-radius:12px; font-size:0.85rem; color:var(--color-moss); font-weight:500; margin-bottom:0.75rem; }
  .dark .fl-selected-banner { background:rgba(59,109,17,0.12); color:var(--color-sage); }

  .fl-custom-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-bottom:0.75rem; }
  .fl-custom-label { font-size:0.68rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-warm-mid); margin-bottom:0.3rem; }
  .dark .fl-custom-label { color:#6b7280; }

  .fl-partial-section { background:rgba(44,36,25,0.03); border-radius:12px; padding:0.75rem 1rem; margin-bottom:0.75rem; }
  .dark .fl-partial-section { background:rgba(255,255,255,0.03); }
  .fl-partial-btns { display:flex; gap:0.5rem; }
  .fl-partial-btn { flex:1; padding:0.45rem; border-radius:100px; border:1px solid rgba(44,36,25,0.12); background:transparent; font-family:var(--font-sans); font-size:0.75rem; cursor:pointer; transition:all 0.15s; color:var(--color-bark); }
  .fl-partial-btn:hover { background:var(--color-sage-pale); border-color:var(--color-moss); }
  .dark .fl-partial-btn { border-color:rgba(255,255,255,0.1); color:#F5F0E8; }

  .fl-modal-actions { display:flex; gap:0.75rem; margin-top:1.25rem; }
  .fl-modal-confirm { flex:1; padding:0.8rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:0.9rem; font-weight:500; cursor:pointer; transition:background 0.2s, transform 0.15s; }
  .fl-modal-confirm:hover:not(:disabled) { background:var(--color-moss); transform:translateY(-1px); }
  .fl-modal-confirm:disabled { opacity:0.6; cursor:not-allowed; }
  .dark .fl-modal-confirm { background:var(--color-moss); }
  .dark .fl-modal-confirm:hover:not(:disabled) { background:var(--color-sage); color:#0f0f0f; }
  .fl-modal-cancel { flex:1; padding:0.8rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.15); background:transparent; color:var(--color-bark); font-family:var(--font-sans); font-size:0.9rem; cursor:pointer; transition:background 0.2s; }
  .fl-modal-cancel:hover { background:rgba(44,36,25,0.05); }
  .dark .fl-modal-cancel { border-color:rgba(255,255,255,0.12); color:#F5F0E8; }

  @media(max-width:640px){
    .fl-summary { grid-template-columns:repeat(2,1fr); }
    .fl-tab { padding:0.45rem 0.8rem; font-size:0.8rem; }
    .fl-custom-grid { grid-template-columns:1fr; }
  }
`