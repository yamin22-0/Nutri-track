import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMeals, addMeal, deleteMeal, getFoods } from '../api'
import toast from 'react-hot-toast'

const mealCategories = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch',     label: 'Lunch',     icon: '🥗' },
  { id: 'dinner',    label: 'Dinner',    icon: '🍛' },
  { id: 'snack',     label: 'Snack',     icon: '🍎' },
]

function FoodLog() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab]       = useState('breakfast')
  const [meals, setMeals]               = useState([])
  const [foods, setFoods]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [search, setSearch]             = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [addMode, setAddMode]           = useState('search')
  const [custom, setCustom]             = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [saving, setSaving]             = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => { loadMeals() }, [selectedDate])
  useEffect(() => { getFoods().then(setFoods).catch(() => {}) }, [])

  async function loadMeals() {
    setLoading(true)
    try {
      const data = await getMeals(user.id, selectedDate)
      setMeals(data || [])
    } catch {
      toast.error('Failed to load meals')
    } finally {
      setLoading(false)
    }
  }

  const currentMeals = meals.filter(m => m.mealType === activeTab)

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein:  acc.protein  + Number(m.protein  || 0),
    carbs:    acc.carbs    + Number(m.carbs    || 0),
    fat:      acc.fat      + Number(m.fat      || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAdd() {
    setSaving(true)
    try {
      let meal
      if (addMode === 'search') {
        if (!selectedFood) { toast.error('Please select a food'); return }
        meal = { userId: user.id, name: selectedFood.name, calories: selectedFood.calories, protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat, mealType: activeTab, date: selectedDate }
      } else {
        if (!custom.name) { toast.error('Please enter a meal name'); return }
        meal = { userId: user.id, name: custom.name, calories: Number(custom.calories) || 0, protein: Number(custom.protein) || 0, carbs: Number(custom.carbs) || 0, fat: Number(custom.fat) || 0, mealType: activeTab, date: selectedDate }
      }
      await addMeal(meal)
      await loadMeals()
      toast.success('Meal added!')
      closeModal()
    } catch {
      toast.error('Failed to add meal')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteMeal(id)
      setMeals(prev => prev.filter(m => m.id !== id))
      toast.success('Meal removed')
    } catch {
      toast.error('Failed to remove meal')
    }
  }

  function openModal() {
    setShowModal(true); setSearch(''); setSelectedFood(null)
    setCustom({ name: '', calories: '', protein: '', carbs: '', fat: '' }); setAddMode('search')
  }
  function closeModal() { setShowModal(false); setSearch(''); setSelectedFood(null) }

  const activeCat = mealCategories.find(c => c.id === activeTab)

  return (
    <>
      <style>{`
        .fl-page { min-height: 100vh; padding-top: 64px; background: var(--color-cream); }
        .dark .fl-page { background: #0f0f0f; }
        .fl-inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }
        .fl-title { font-family: var(--font-serif); font-size: clamp(1.6rem,3vw,2rem); font-weight: 700; color: var(--color-bark); letter-spacing: -0.03em; margin-bottom: 0.3rem; }
        .dark .fl-title { color: #F5F0E8; }
        .fl-sub { font-size: 0.875rem; font-weight: 300; color: var(--color-warm-mid); margin-bottom: 1.75rem; }
        .fl-datebar { display: flex; align-items: center; gap: 1rem; background: #fff; border: 1px solid rgba(44,36,25,0.09); border-radius: 14px; padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; }
        .dark .fl-datebar { background: #1a1a1a; border-color: rgba(255,255,255,0.07); }
        .fl-date-label { font-size: 0.8rem; font-weight: 500; color: var(--color-warm-mid); }
        .fl-date-input { padding: 0.45rem 0.9rem; border-radius: 10px; border: 1px solid rgba(44,36,25,0.12); background: var(--color-cream); color: var(--color-bark); font-family: var(--font-sans); font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
        .fl-date-input:focus { border-color: var(--color-moss); }
        .dark .fl-date-input { background: #252525; border-color: rgba(255,255,255,0.1); color: #F5F0E8; }
        .fl-summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.75rem; }
        .fl-summary-card { background: #fff; border: 1px solid rgba(44,36,25,0.09); border-radius: 16px; padding: 1.25rem 1rem; text-align: center; box-shadow: 0 2px 12px rgba(44,36,25,0.04); transition: transform 0.2s, box-shadow 0.2s; }
        .fl-summary-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(44,36,25,0.07); }
        .dark .fl-summary-card { background: #1a1a1a; border-color: rgba(255,255,255,0.07); }
        .fl-summary-val { font-family: var(--font-serif); font-size: 1.65rem; font-weight: 700; color: var(--color-bark); letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.3rem; }
        .dark .fl-summary-val { color: #F5F0E8; }
        .fl-summary-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-warm-mid); }
        .fl-summary-bar { height: 3px; border-radius: 100px; background: var(--color-sage); margin-top: 0.85rem; opacity: 0.6; }
        .fl-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .fl-tab { display: flex; align-items: center; gap: 0.45rem; padding: 0.55rem 1.1rem; border-radius: 100px; border: 1.5px solid rgba(44,36,25,0.1); background: #fff; font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500; color: var(--color-bark); cursor: pointer; transition: all 0.18s; }
        .dark .fl-tab { background: #1a1a1a; border-color: rgba(255,255,255,0.08); color: #94a3b8; }
        .fl-tab:hover { border-color: var(--color-moss); color: var(--color-moss); }
        .fl-tab.active { background: var(--color-bark); border-color: var(--color-bark); color: var(--color-cream); }
        .dark .fl-tab.active { background: var(--color-moss); border-color: var(--color-moss); color: #fff; }
        .fl-card { background: #fff; border: 1px solid rgba(44,36,25,0.09); border-radius: 20px; overflow: hidden; box-shadow: 0 2px 16px rgba(44,36,25,0.05); }
        .dark .fl-card { background: #1a1a1a; border-color: rgba(255,255,255,0.07); }
        .fl-card-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(44,36,25,0.07); background: rgba(44,36,25,0.015); }
        .dark .fl-card-header { background: rgba(255,255,255,0.015); border-bottom-color: rgba(255,255,255,0.06); }
        .fl-card-title { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--color-bark); }
        .dark .fl-card-title { color: #F5F0E8; }
        .fl-add-btn { padding: 0.4rem 1rem; border-radius: 100px; background: var(--color-sage-pale); border: 1px solid rgba(59,109,17,0.15); font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; color: var(--color-moss); cursor: pointer; transition: background 0.2s; }
        .fl-add-btn:hover { background: var(--color-sage-light); }
        .dark .fl-add-btn { background: rgba(59,109,17,0.12); border-color: rgba(151,196,89,0.2); color: var(--color-sage); }
        .fl-meal { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(44,36,25,0.06); transition: background 0.15s; }
        .fl-meal:last-child { border-bottom: none; }
        .fl-meal:hover { background: var(--color-sage-pale); }
        .dark .fl-meal { border-bottom-color: rgba(255,255,255,0.05); }
        .dark .fl-meal:hover { background: rgba(255,255,255,0.025); }
        .fl-meal-info { flex: 1; }
        .fl-meal-name { font-size: 0.9rem; font-weight: 600; color: var(--color-bark); margin-bottom: 0.25rem; }
        .dark .fl-meal-name { color: #F5F0E8; }
        .fl-meal-macros { display: flex; gap: 0.75rem; font-size: 0.72rem; color: var(--color-warm-mid); flex-wrap: wrap; }
        .fl-meal-right { display: flex; align-items: center; gap: 1rem; }
        .fl-meal-kcal { font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700; color: var(--color-bark); white-space: nowrap; }
        .dark .fl-meal-kcal { color: #F5F0E8; }
        .fl-meal-remove { width: 26px; height: 26px; border-radius: 50%; background: transparent; border: 1px solid rgba(44,36,25,0.12); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; color: var(--color-warm-mid); cursor: pointer; transition: all 0.15s; }
        .fl-meal-remove:hover { background: rgba(239,68,68,0.08); border-color: #ef4444; color: #ef4444; }
        .dark .fl-meal-remove { border-color: rgba(255,255,255,0.1); }
        .fl-empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem 2rem; text-align: center; color: var(--color-warm-mid); font-size: 0.875rem; }
        .fl-empty-icon { font-size: 2.5rem; opacity: 0.45; }
        .fl-loading { text-align: center; padding: 3rem; color: var(--color-warm-mid); font-size: 0.875rem; }
        .fl-modal-overlay { position: fixed; inset: 0; background: rgba(44,36,25,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
        .fl-modal { background: var(--color-cream); border-radius: 24px; padding: 2rem; width: 100%; max-width: 460px; box-shadow: 0 24px 64px rgba(44,36,25,0.18); max-height: 90vh; overflow-y: auto; }
        .dark .fl-modal { background: #1a1a1a; }
        .fl-modal-title { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--color-bark); letter-spacing: -0.02em; margin-bottom: 1.25rem; }
        .dark .fl-modal-title { color: #F5F0E8; }
        .fl-mode-toggle { display: flex; background: rgba(44,36,25,0.06); border-radius: 100px; padding: 3px; margin-bottom: 1.25rem; }
        .dark .fl-mode-toggle { background: rgba(255,255,255,0.06); }
        .fl-mode-btn { flex: 1; padding: 0.45rem; border-radius: 100px; border: none; background: transparent; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 500; color: var(--color-warm-mid); cursor: pointer; transition: all 0.18s; }
        .fl-mode-btn.active { background: #fff; color: var(--color-bark); box-shadow: 0 1px 6px rgba(44,36,25,0.1); }
        .dark .fl-mode-btn.active { background: #2a2a2a; color: #F5F0E8; }
        .fl-modal-input { width: 100%; padding: 0.8rem 1rem; border-radius: 12px; border: 1.5px solid rgba(44,36,25,0.12); background: #fff; color: var(--color-bark); font-family: var(--font-sans); font-size: 0.9rem; outline: none; margin-bottom: 0.75rem; transition: border-color 0.2s, box-shadow 0.2s; }
        .fl-modal-input:focus { border-color: var(--color-moss); box-shadow: 0 0 0 3px rgba(59,109,17,0.1); }
        .dark .fl-modal-input { background: #252525; border-color: rgba(255,255,255,0.1); color: #F5F0E8; }
        .dark .fl-modal-input::placeholder { color: rgba(255,255,255,0.25); }
        .fl-food-list { max-height: 220px; overflow-y: auto; border: 1px solid rgba(44,36,25,0.09); border-radius: 12px; margin-bottom: 1rem; }
        .dark .fl-food-list { border-color: rgba(255,255,255,0.07); }
        .fl-food-item { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 1rem; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(44,36,25,0.05); }
        .fl-food-item:last-child { border-bottom: none; }
        .fl-food-item:hover { background: var(--color-sage-pale); }
        .dark .fl-food-item:hover { background: rgba(255,255,255,0.04); }
        .fl-food-item.selected { background: var(--color-sage-pale); border-left: 3px solid var(--color-moss); }
        .dark .fl-food-item.selected { background: rgba(59,109,17,0.12); border-left-color: var(--color-sage); }
        .fl-food-name { font-size: 0.875rem; font-weight: 500; color: var(--color-bark); }
        .dark .fl-food-name { color: #F5F0E8; }
        .fl-food-meta { font-size: 0.72rem; color: var(--color-warm-mid); }
        .fl-custom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.75rem; }
        .fl-custom-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-warm-mid); margin-bottom: 0.3rem; }
        .dark .fl-custom-label { color: #6b7280; }
        .fl-selected-banner { padding: 0.75rem 1rem; background: var(--color-sage-pale); border-radius: 12px; font-size: 0.85rem; color: var(--color-moss); font-weight: 500; margin-bottom: 0.75rem; }
        .dark .fl-selected-banner { background: rgba(59,109,17,0.12); color: var(--color-sage); }
        .fl-modal-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
        .fl-modal-confirm { flex: 1; padding: 0.8rem; border-radius: 100px; border: none; background: var(--color-bark); color: var(--color-cream); font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .fl-modal-confirm:hover:not(:disabled) { background: var(--color-moss); transform: translateY(-1px); }
        .fl-modal-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
        .dark .fl-modal-confirm { background: var(--color-moss); }
        .dark .fl-modal-confirm:hover:not(:disabled) { background: var(--color-sage); color: #0f0f0f; }
        .fl-modal-cancel { flex: 1; padding: 0.8rem; border-radius: 100px; border: 1.5px solid rgba(44,36,25,0.15); background: transparent; color: var(--color-bark); font-family: var(--font-sans); font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
        .fl-modal-cancel:hover { background: rgba(44,36,25,0.05); }
        .dark .fl-modal-cancel { border-color: rgba(255,255,255,0.12); color: #F5F0E8; }
        @media (max-width: 640px) {
          .fl-inner { padding: 1.25rem 1rem 3rem; }
          .fl-summary { grid-template-columns: repeat(2,1fr); }
          .fl-tab { padding: 0.45rem 0.85rem; font-size: 0.8rem; }
        }
      `}</style>

      <div className="fl-page">
        <div className="fl-inner">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h1 className="fl-title">Food Log</h1>
            <p className="fl-sub">Track your daily meals and nutrition</p>
          </motion.div>

          <motion.div className="fl-datebar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="fl-date-label">📅 Date</span>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="fl-date-input" />
          </motion.div>

          <motion.div className="fl-summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {[
              { label: 'Calories', value: totals.calories },
              { label: 'Protein',  value: `${totals.protein}g` },
              { label: 'Carbs',    value: `${totals.carbs}g` },
              { label: 'Fat',      value: `${totals.fat}g` },
            ].map(({ label, value }) => (
              <div className="fl-summary-card" key={label}>
                <div className="fl-summary-val">{value}</div>
                <div className="fl-summary-label">{label}</div>
                <div className="fl-summary-bar" />
              </div>
            ))}
          </motion.div>

          <motion.div className="fl-tabs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {mealCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`fl-tab ${activeTab === cat.id ? 'active' : ''}`}>
                <span>{cat.icon}</span><span>{cat.label}</span>
              </button>
            ))}
          </motion.div>

          <motion.div className="fl-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="fl-card-header">
              <div className="fl-card-title"><span>{activeCat?.icon}</span><span>{activeCat?.label}</span></div>
              <button className="fl-add-btn" onClick={openModal}>+ Add Item</button>
            </div>

            {loading ? (
              <div className="fl-loading">Loading meals…</div>
            ) : currentMeals.length > 0 ? currentMeals.map(meal => (
              <div key={meal.id} className="fl-meal">
                <div className="fl-meal-info">
                  <div className="fl-meal-name">{meal.name}</div>
                  <div className="fl-meal-macros">
                    <span>💪 {meal.protein}g protein</span>
                    <span>🍚 {meal.carbs}g carbs</span>
                    <span>🥑 {meal.fat}g fat</span>
                  </div>
                </div>
                <div className="fl-meal-right">
                  <span className="fl-meal-kcal">{meal.calories} kcal</span>
                  <button className="fl-meal-remove" onClick={() => handleDelete(meal.id)} title="Remove">✕</button>
                </div>
              </div>
            )) : (
              <div className="fl-empty">
                <div className="fl-empty-icon">🍽️</div>
                <div>No meals logged for {activeCat?.label.toLowerCase()}</div>
                <button className="fl-add-btn" onClick={openModal}>Add your first meal</button>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {showModal && (
        <div className="fl-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <motion.div className="fl-modal" initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="fl-modal-title">Add to {activeCat?.label}</div>

            <div className="fl-mode-toggle">
              <button className={`fl-mode-btn ${addMode === 'search' ? 'active' : ''}`} onClick={() => setAddMode('search')}>Search Foods</button>
              <button className={`fl-mode-btn ${addMode === 'custom' ? 'active' : ''}`} onClick={() => setAddMode('custom')}>Custom Entry</button>
            </div>

            {addMode === 'search' ? (
              <>
                <input className="fl-modal-input" placeholder="Search food database..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                <div className="fl-food-list">
                  {filteredFoods.length > 0 ? filteredFoods.map(food => (
                    <div key={food.id} className={`fl-food-item ${selectedFood?.id === food.id ? 'selected' : ''}`} onClick={() => setSelectedFood(food)}>
                      <div>
                        <div className="fl-food-name">{food.name}</div>
                        <div className="fl-food-meta">{food.protein}g P · {food.carbs}g C · {food.fat}g F</div>
                      </div>
                      <div className="fl-food-meta">{food.calories} kcal</div>
                    </div>
                  )) : (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-warm-mid)', fontSize: '0.875rem' }}>No foods found</div>
                  )}
                </div>
                {selectedFood && (
                  <div className="fl-selected-banner">✓ {selectedFood.name} — {selectedFood.calories} kcal</div>
                )}
              </>
            ) : (
              <>
                <div style={{ marginBottom: '0.6rem' }}>
                  <div className="fl-custom-label">Meal Name</div>
                  <input className="fl-modal-input" style={{ marginBottom: 0 }} placeholder="e.g. Rice and Beans" value={custom.name} onChange={e => setCustom(p => ({ ...p, name: e.target.value }))} autoFocus />
                </div>
                <div className="fl-custom-grid">
                  {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([key, label]) => (
                    <div key={key}>
                      <div className="fl-custom-label">{label}</div>
                      <input className="fl-modal-input" style={{ marginBottom: 0 }} type="number" min="0" placeholder="0" value={custom[key]} onChange={e => setCustom(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="fl-modal-actions">
              <button className="fl-modal-confirm" onClick={handleAdd} disabled={saving}>{saving ? 'Adding…' : 'Add Meal'}</button>
              <button className="fl-modal-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default FoodLog