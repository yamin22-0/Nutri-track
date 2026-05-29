import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFoods, addFood, deleteFood, getMeals, addMeal } from '../api'
import toast from 'react-hot-toast'

const categories = [
  { id: 'all',       label: 'All',         icon: '🍽️' },
  { id: 'bread',     label: 'Breads',      icon: '🍞' },
  { id: 'vegetable', label: 'Vegetables',  icon: '🥦' },
  { id: 'protein',   label: 'Protein',     icon: '🍗' },
  { id: 'grain',     label: 'Grains',      icon: '🌾' },
  { id: 'rice',      label: 'Rice',        icon: '🍚' },
  { id: 'legume',    label: 'Legumes',     icon: '🫘' },
  { id: 'salad',     label: 'Salads',      icon: '🥗' },
  { id: 'main',      label: 'Main Dishes', icon: '🍛' },
  { id: 'snack',     label: 'Snacks',      icon: '🍎' },
  { id: 'breakfast', label: 'Breakfast',   icon: '🍳' },
]

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch',     label: 'Lunch',     icon: '🥗' },
  { id: 'dinner',    label: 'Dinner',    icon: '🍛' },
  { id: 'snack',     label: 'Snack',     icon: '🍎' },
]

function MacroBar({ label, value, max, color }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div className="mfl-macrobar">
      <div className="mfl-macrobar-top">
        <span className="mfl-macrobar-label">{label}</span>
        <span className="mfl-macrobar-val" style={{ color }}>{value}g</span>
      </div>
      <div className="mfl-macrobar-track">
        <div className="mfl-macrobar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function MyFoodList() {
  const [searchTerm, setSearchTerm]       = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [foods, setFoods]                 = useState([])
  const [loading, setLoading]             = useState(true)
  const [showAddModal, setShowAddModal]   = useState(false)
  const [detailFood, setDetailFood]       = useState(null)
  const [addToLogFood, setAddToLogFood]   = useState(null)
  const [selectedMealType, setSelectedMealType] = useState('breakfast')
  const [loggingMeal, setLoggingMeal]     = useState(false)
  const [imgErrors, setImgErrors]         = useState({})
  const [newFood, setNewFood]             = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '', category: 'snack',
  })
  const [saving, setSaving] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getFoods()
      .then(data => setFoods(data || []))
      .catch(() => toast.error('Failed to load foods'))
      .finally(() => setLoading(false))
  }, [])

  const filteredFoods = foods.filter(food => {
    const matchSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat    = activeCategory === 'all' || food.category === activeCategory
    return matchSearch && matchCat
  })

  async function handleDelete(id) {
    try {
      await deleteFood(id)
      setFoods(prev => prev.filter(f => f.id !== id))
      if (detailFood?.id === id) setDetailFood(null)
      toast.success('Food deleted')
    } catch { toast.error('Failed to delete food') }
  }

  async function handleAddFood() {
    if (!newFood.name || !newFood.calories) {
      toast.error('Please fill in food name and calories')
      return
    }
    setSaving(true)
    try {
      const added = await addFood({
        name:     newFood.name,
        calories: parseInt(newFood.calories),
        protein:  parseInt(newFood.protein)  || 0,
        carbs:    parseInt(newFood.carbs)    || 0,
        fat:      parseInt(newFood.fat)      || 0,
        category: newFood.category,
        imageUrl: `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop`,
        benefits: 'A nutritious food choice added to your personal list.',
        cookTips: 'Prepare according to your preferred method.',
      })
      setFoods(prev => [...prev, added])
      setShowAddModal(false)
      setNewFood({ name:'', calories:'', protein:'', carbs:'', fat:'', category:'snack' })
      toast.success('Food added!')
    } catch { toast.error('Failed to add food') }
    finally { setSaving(false) }
  }

  async function handleAddToLog() {
    if (!addToLogFood) return
    setLoggingMeal(true)
    try {
      await addMeal({
        userId:   user.id,
        name:     addToLogFood.name,
        calories: addToLogFood.calories,
        protein:  addToLogFood.protein,
        carbs:    addToLogFood.carbs,
        fat:      addToLogFood.fat,
        mealType: selectedMealType,
        date:     today,
      })
      toast.success(`Added ${addToLogFood.name} to ${selectedMealType}!`)
      setAddToLogFood(null)
      setDetailFood(null)
    } catch { toast.error('Failed to log meal') }
    finally { setLoggingMeal(false) }
  }

  const catIcon = id => categories.find(c => c.id === id)?.icon || '🍽️'

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', color:'var(--color-warm-mid)', fontSize:'0.9rem' }}>
      Loading foods…
    </div>
  )

  return (
    <>
      <style>{css}</style>

      <div className="mfl-page">
        <div className="mfl-inner">

          {/* Header */}
          <motion.div className="mfl-header" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div>
              <h1 className="mfl-title">My Food List</h1>
              <p className="mfl-sub">Your personal collection · {foods.length} foods</p>
            </div>
            <button className="mfl-add-btn" onClick={() => setShowAddModal(true)}>+ Add Food</button>
          </motion.div>

          {/* Search */}
          <motion.div className="mfl-search-wrap" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
            <span className="mfl-search-icon">🔍</span>
            <input
              type="text"
              className="mfl-search-input"
              placeholder="Search foods…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="mfl-search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </motion.div>

          {/* Category pills */}
          <motion.div className="mfl-cats" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`mfl-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id !== 'all' && (
                  <span className="mfl-cat-count">
                    {foods.filter(f => f.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div className="mfl-grid" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
            {filteredFoods.length > 0 ? filteredFoods.map((food, i) => (
              <motion.div
                key={food.id}
                className="mfl-card"
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.05 * (i % 8) }}
                onClick={() => setDetailFood(food)}
              >
                <div className="mfl-card-img-wrap">
                  {!imgErrors[food.id] && food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="mfl-card-img"
                      onError={() => setImgErrors(prev => ({ ...prev, [food.id]: true }))}
                    />
                  ) : (
                    <div className="mfl-card-img-fallback">
                      <span>{catIcon(food.category)}</span>
                    </div>
                  )}
                  <div className="mfl-card-cat-badge">{catIcon(food.category)}</div>
                  <button
                    className="mfl-card-del"
                    onClick={e => { e.stopPropagation(); handleDelete(food.id) }}
                    title="Delete"
                  >✕</button>
                </div>
                <div className="mfl-card-body">
                  <div className="mfl-card-name">{food.name}</div>
                  <div className="mfl-card-macros">
                    <span title="Protein">💪 {food.protein}g</span>
                    <span title="Carbs">🍚 {food.carbs}g</span>
                    <span title="Fat">🥑 {food.fat}g</span>
                  </div>
                  <div className="mfl-card-bottom">
                    <span className="mfl-card-kcal">{food.calories} kcal</span>
                    <span className="mfl-card-per">per 100g</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="mfl-empty">
                <div className="mfl-empty-icon">🍽️</div>
                <div>No foods found</div>
                <button className="mfl-add-btn" style={{ marginTop:'1rem' }} onClick={() => setShowAddModal(true)}>
                  Add your first food
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {detailFood && (
          <div className="mfl-overlay" onClick={e => e.target === e.currentTarget && setDetailFood(null)}>
            <motion.div
              className="mfl-detail-modal"
              initial={{ opacity:0, scale:0.95, y:24 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:24 }}
              transition={{ duration:0.22, ease:'easeOut' }}
            >
              {/* Image hero */}
              <div className="mfl-detail-img-wrap">
                {!imgErrors[detailFood.id] && detailFood.imageUrl ? (
                  <img src={detailFood.imageUrl} alt={detailFood.name} className="mfl-detail-img"
                    onError={() => setImgErrors(prev => ({ ...prev, [detailFood.id]: true }))} />
                ) : (
                  <div className="mfl-detail-img-fallback">
                    <span>{catIcon(detailFood.category)}</span>
                  </div>
                )}
                <button className="mfl-detail-close" onClick={() => setDetailFood(null)}>✕</button>
                <div className="mfl-detail-img-overlay">
                  <div className="mfl-detail-name">{detailFood.name}</div>
                  <div className="mfl-detail-cat">{catIcon(detailFood.category)} {detailFood.category}</div>
                </div>
              </div>

              <div className="mfl-detail-body">
                {/* Calorie headline */}
                <div className="mfl-detail-kcal-row">
                  <div className="mfl-detail-kcal-card">
                    <div className="mfl-detail-kcal-val">{detailFood.calories}</div>
                    <div className="mfl-detail-kcal-label">kcal / 100g</div>
                  </div>
                  <div className="mfl-detail-macros-mini">
                    <div><strong>{detailFood.protein}g</strong> Protein</div>
                    <div><strong>{detailFood.carbs}g</strong> Carbs</div>
                    <div><strong>{detailFood.fat}g</strong> Fat</div>
                  </div>
                </div>

                {/* Macro bars */}
                <div className="mfl-detail-bars">
                  <MacroBar label="Protein" value={detailFood.protein} max={50}  color="#3b82f6" />
                  <MacroBar label="Carbs"   value={detailFood.carbs}   max={100} color="#d97706" />
                  <MacroBar label="Fat"     value={detailFood.fat}     max={40}  color="#8b5cf6" />
                </div>

                {/* Benefits */}
                {detailFood.benefits && (
                  <div className="mfl-detail-section">
                    <div className="mfl-detail-section-title">🌿 Health Benefits</div>
                    <p className="mfl-detail-section-text">{detailFood.benefits}</p>
                  </div>
                )}

                {/* Cook tips */}
                {detailFood.cookTips && (
                  <div className="mfl-detail-section">
                    <div className="mfl-detail-section-title">👨‍🍳 Preparation Tips</div>
                    <p className="mfl-detail-section-text">{detailFood.cookTips}</p>
                  </div>
                )}

                {/* Add to Log CTA */}
                <div className="mfl-detail-log-section">
                  <div className="mfl-detail-section-title" style={{ marginBottom:'0.75rem' }}>📋 Add to Food Log</div>
                  <div className="mfl-meal-type-pills">
                    {mealTypes.map(mt => (
                      <button
                        key={mt.id}
                        className={`mfl-mt-pill ${selectedMealType === mt.id ? 'active' : ''}`}
                        onClick={() => setSelectedMealType(mt.id)}
                      >
                        {mt.icon} {mt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    className="mfl-detail-log-btn"
                    onClick={() => { setAddToLogFood(detailFood); handleAddToLog() }}
                    disabled={loggingMeal}
                  >
                    {loggingMeal ? 'Adding…' : `+ Add to ${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Today`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD FOOD MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="mfl-overlay" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
            <motion.div
              className="mfl-add-modal"
              initial={{ opacity:0, scale:0.95, y:16 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:16 }}
              transition={{ duration:0.2 }}
            >
              <div className="mfl-add-modal-title">Add New Food</div>
              <input className="mfl-modal-input" placeholder="Food name *" value={newFood.name}
                onChange={e => setNewFood(p => ({ ...p, name:e.target.value }))} autoFocus />
              <input className="mfl-modal-input" type="number" placeholder="Calories per 100g *" value={newFood.calories}
                onChange={e => setNewFood(p => ({ ...p, calories:e.target.value }))} />
              <div className="mfl-modal-row">
                <div>
                  <div className="mfl-modal-label">Protein (g)</div>
                  <input className="mfl-modal-input" type="number" min="0" placeholder="0" value={newFood.protein}
                    onChange={e => setNewFood(p => ({ ...p, protein:e.target.value }))} />
                </div>
                <div>
                  <div className="mfl-modal-label">Carbs (g)</div>
                  <input className="mfl-modal-input" type="number" min="0" placeholder="0" value={newFood.carbs}
                    onChange={e => setNewFood(p => ({ ...p, carbs:e.target.value }))} />
                </div>
                <div>
                  <div className="mfl-modal-label">Fat (g)</div>
                  <input className="mfl-modal-input" type="number" min="0" placeholder="0" value={newFood.fat}
                    onChange={e => setNewFood(p => ({ ...p, fat:e.target.value }))} />
                </div>
              </div>
              <div className="mfl-modal-label">Category</div>
              <select className="mfl-modal-input mfl-modal-select" value={newFood.category}
                onChange={e => setNewFood(p => ({ ...p, category:e.target.value }))}>
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
              <div className="mfl-modal-actions">
                <button className="mfl-modal-confirm" onClick={handleAddFood} disabled={saving}>
                  {saving ? 'Adding…' : 'Add Food'}
                </button>
                <button className="mfl-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

const css = `
  .mfl-page { min-height:100vh; background:var(--color-cream); padding-top:64px; }
  .dark .mfl-page { background:#0f0f0f; }
  .mfl-inner { max-width:1200px; margin:0 auto; padding:2rem 2rem 4rem; }
  @media(max-width:768px){ .mfl-inner{padding:1.25rem 1rem 3rem;} }

  /* Header */
  .mfl-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem; }
  .mfl-title { font-family:var(--font-serif); font-size:clamp(1.6rem,3vw,2.1rem); font-weight:700; color:var(--color-bark); letter-spacing:-0.03em; margin-bottom:0.2rem; }
  .dark .mfl-title { color:#F5F0E8; }
  .mfl-sub { font-size:0.85rem; color:var(--color-warm-mid); }
  .mfl-add-btn { padding:0.7rem 1.5rem; border-radius:100px; background:var(--color-bark); color:var(--color-cream); border:none; font-family:var(--font-sans); font-size:0.875rem; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; white-space:nowrap; }
  .mfl-add-btn:hover { background:var(--color-moss); transform:translateY(-1px); }
  .dark .mfl-add-btn { background:var(--color-moss); }

  /* Search */
  .mfl-search-wrap { position:relative; margin-bottom:1.25rem; }
  .mfl-search-icon { position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:0.9rem; }
  .mfl-search-input { width:100%; padding:0.85rem 2.8rem 0.85rem 2.6rem; border-radius:60px; border:1.5px solid rgba(44,36,25,0.1); background:#fff; color:var(--color-bark); font-family:var(--font-sans); font-size:0.9rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
  .mfl-search-input:focus { border-color:var(--color-moss); box-shadow:0 0 0 3px rgba(59,109,17,0.1); }
  .dark .mfl-search-input { background:#1a1a1a; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .mfl-search-clear { position:absolute; right:1rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--color-warm-mid); font-size:0.75rem; padding:0.25rem; }

  /* Categories */
  .mfl-cats { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.75rem; }
  .mfl-cat-btn { display:flex; align-items:center; gap:0.4rem; padding:0.45rem 0.9rem; border-radius:100px; background:#fff; border:1.5px solid rgba(44,36,25,0.1); font-family:var(--font-sans); font-size:0.8rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .dark .mfl-cat-btn { background:#1a1a1a; border-color:rgba(255,255,255,0.08); color:#94a3b8; }
  .mfl-cat-btn:hover { border-color:var(--color-moss); color:var(--color-moss); }
  .mfl-cat-btn.active { background:var(--color-bark); border-color:var(--color-bark); color:var(--color-cream); }
  .dark .mfl-cat-btn.active { background:var(--color-moss); border-color:var(--color-moss); color:#fff; }
  .mfl-cat-count { background:rgba(255,255,255,0.2); border-radius:100px; padding:0.05rem 5px; font-size:0.65rem; }
  .mfl-cat-btn:not(.active) .mfl-cat-count { background:rgba(44,36,25,0.08); }
  .dark .mfl-cat-btn:not(.active) .mfl-cat-count { background:rgba(255,255,255,0.08); }

  /* Grid */
  .mfl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.25rem; }
  @media(max-width:640px){ .mfl-grid{grid-template-columns:repeat(2,1fr); gap:0.75rem;} }

  /* Card */
  .mfl-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; overflow:hidden; cursor:pointer; transition:all 0.22s; box-shadow:0 2px 8px rgba(44,36,25,0.04); }
  .mfl-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(44,36,25,0.12); border-color:rgba(59,109,17,0.2); }
  .dark .mfl-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
  .dark .mfl-card:hover { box-shadow:0 12px 32px rgba(0,0,0,0.3); }

  .mfl-card-img-wrap { position:relative; width:100%; aspect-ratio:4/3; overflow:hidden; background:var(--color-sage-pale); }
  .mfl-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s; }
  .mfl-card:hover .mfl-card-img { transform:scale(1.06); }
  .mfl-card-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; background:var(--color-sage-pale); }
  .dark .mfl-card-img-fallback { background:rgba(255,255,255,0.04); }

  .mfl-card-cat-badge { position:absolute; top:8px; left:8px; background:rgba(255,255,255,0.9); backdrop-filter:blur(6px); border-radius:8px; padding:3px 7px; font-size:0.9rem; box-shadow:0 1px 4px rgba(0,0,0,0.1); }
  .dark .mfl-card-cat-badge { background:rgba(0,0,0,0.6); }
  .mfl-card-del { position:absolute; top:8px; right:8px; width:26px; height:26px; border-radius:50%; background:rgba(239,68,68,0.85); border:none; color:#fff; font-size:0.65rem; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; }
  .mfl-card:hover .mfl-card-del { opacity:1; }

  .mfl-card-body { padding:0.9rem 1rem 1rem; }
  .mfl-card-name { font-size:0.875rem; font-weight:700; color:var(--color-bark); margin-bottom:0.4rem; line-height:1.3; }
  .dark .mfl-card-name { color:#F5F0E8; }
  .mfl-card-macros { display:flex; gap:0.5rem; font-size:0.68rem; color:var(--color-warm-mid); flex-wrap:wrap; margin-bottom:0.5rem; }
  .mfl-card-bottom { display:flex; align-items:baseline; justify-content:space-between; }
  .mfl-card-kcal { font-family:var(--font-serif); font-size:1.05rem; font-weight:700; color:var(--color-moss); }
  .dark .mfl-card-kcal { color:var(--color-sage); }
  .mfl-card-per { font-size:0.65rem; color:var(--color-warm-mid); }

  /* Empty */
  .mfl-empty { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:4rem 2rem; text-align:center; color:var(--color-warm-mid); font-size:0.9rem; }
  .mfl-empty-icon { font-size:3rem; opacity:0.35; }

  /* Overlay */
  .mfl-overlay { position:fixed; inset:0; background:rgba(20,16,10,0.65); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:300; padding:1rem; overflow-y:auto; }

  /* Detail Modal */
  .mfl-detail-modal { background:var(--color-cream); border-radius:28px; width:100%; max-width:520px; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,0.25); max-height:90vh; overflow-y:auto; }
  .dark .mfl-detail-modal { background:#161616; }

  .mfl-detail-img-wrap { position:relative; width:100%; height:260px; overflow:hidden; background:var(--color-sage-pale); flex-shrink:0; }
  .mfl-detail-img { width:100%; height:100%; object-fit:cover; }
  .mfl-detail-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:5rem; background:var(--color-sage-pale); }
  .mfl-detail-close { position:absolute; top:12px; right:12px; width:34px; height:34px; border-radius:50%; background:rgba(0,0,0,0.5); border:none; color:#fff; font-size:0.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); transition:background 0.2s; z-index:1; }
  .mfl-detail-close:hover { background:rgba(239,68,68,0.8); }
  .mfl-detail-img-overlay { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,rgba(0,0,0,0.72)); padding:2rem 1.5rem 1rem; }
  .mfl-detail-name { font-family:var(--font-serif); font-size:1.5rem; font-weight:700; color:#fff; letter-spacing:-0.02em; margin-bottom:0.2rem; }
  .mfl-detail-cat { font-size:0.75rem; color:rgba(255,255,255,0.75); text-transform:capitalize; }

  .mfl-detail-body { padding:1.5rem; }

  .mfl-detail-kcal-row { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.25rem; }
  .mfl-detail-kcal-card { background:var(--color-moss); border-radius:16px; padding:0.75rem 1.25rem; text-align:center; flex-shrink:0; }
  .mfl-detail-kcal-val { font-family:var(--font-serif); font-size:2rem; font-weight:900; color:#fff; line-height:1; }
  .mfl-detail-kcal-label { font-size:0.65rem; color:rgba(255,255,255,0.8); text-transform:uppercase; letter-spacing:0.08em; }
  .mfl-detail-macros-mini { display:flex; flex-direction:column; gap:0.3rem; font-size:0.85rem; color:var(--color-warm-mid); }
  .mfl-detail-macros-mini strong { color:var(--color-bark); }
  .dark .mfl-detail-macros-mini strong { color:#F5F0E8; }

  .mfl-detail-bars { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem; }
  .mfl-macrobar {}
  .mfl-macrobar-top { display:flex; justify-content:space-between; margin-bottom:0.3rem; }
  .mfl-macrobar-label { font-size:0.72rem; font-weight:500; text-transform:uppercase; letter-spacing:0.07em; color:var(--color-warm-mid); }
  .mfl-macrobar-val { font-size:0.72rem; font-weight:700; }
  .mfl-macrobar-track { height:6px; background:rgba(44,36,25,0.08); border-radius:6px; overflow:hidden; }
  .dark .mfl-macrobar-track { background:rgba(255,255,255,0.07); }
  .mfl-macrobar-fill { height:100%; border-radius:6px; transition:width 0.8s ease; }

  .mfl-detail-section { background:rgba(44,36,25,0.03); border-radius:14px; padding:1rem 1.1rem; margin-bottom:1rem; }
  .dark .mfl-detail-section { background:rgba(255,255,255,0.04); }
  .mfl-detail-section-title { font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-moss); margin-bottom:0.5rem; }
  .dark .mfl-detail-section-title { color:var(--color-sage); }
  .mfl-detail-section-text { font-size:0.875rem; color:var(--color-bark); line-height:1.6; }
  .dark .mfl-detail-section-text { color:#D0CEC8; }

  .mfl-detail-log-section { border-top:1px solid rgba(44,36,25,0.07); padding-top:1.25rem; margin-top:0.5rem; }
  .dark .mfl-detail-log-section { border-top-color:rgba(255,255,255,0.06); }
  .mfl-meal-type-pills { display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1rem; }
  .mfl-mt-pill { display:flex; align-items:center; gap:0.35rem; padding:0.4rem 0.85rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.12); background:transparent; font-family:var(--font-sans); font-size:0.8rem; font-weight:500; color:var(--color-bark); cursor:pointer; transition:all 0.18s; }
  .mfl-mt-pill:hover { border-color:var(--color-moss); color:var(--color-moss); }
  .mfl-mt-pill.active { background:var(--color-moss); border-color:var(--color-moss); color:#fff; }
  .dark .mfl-mt-pill { border-color:rgba(255,255,255,0.1); color:#D0CEC8; }
  .dark .mfl-mt-pill.active { background:var(--color-moss); color:#fff; }
  .mfl-detail-log-btn { width:100%; padding:0.875rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .mfl-detail-log-btn:hover:not(:disabled) { background:var(--color-moss); transform:translateY(-1px); }
  .mfl-detail-log-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .dark .mfl-detail-log-btn { background:var(--color-moss); }

  /* Add Modal */
  .mfl-add-modal { background:var(--color-cream); border-radius:24px; padding:2rem; width:100%; max-width:460px; box-shadow:0 24px 64px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto; }
  .dark .mfl-add-modal { background:#1a1a1a; }
  .mfl-add-modal-title { font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--color-bark); margin-bottom:1.25rem; }
  .dark .mfl-add-modal-title { color:#F5F0E8; }
  .mfl-modal-label { font-size:0.68rem; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-warm-mid); margin-bottom:0.3rem; }
  .mfl-modal-input { width:100%; padding:0.8rem 1rem; border-radius:12px; border:1.5px solid rgba(44,36,25,0.12); background:#fff; color:var(--color-bark); font-family:var(--font-sans); font-size:0.9rem; outline:none; margin-bottom:0.75rem; transition:border-color 0.2s,box-shadow 0.2s; }
  .mfl-modal-input:focus { border-color:var(--color-moss); box-shadow:0 0 0 3px rgba(59,109,17,0.1); }
  .dark .mfl-modal-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
  .mfl-modal-select { appearance:none; cursor:pointer; }
  .mfl-modal-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; margin-bottom:0.75rem; }
  .mfl-modal-row .mfl-modal-input { margin-bottom:0; }
  @media(max-width:480px){ .mfl-modal-row{grid-template-columns:1fr;} }
  .mfl-modal-actions { display:flex; gap:0.75rem; margin-top:1rem; }
  .mfl-modal-confirm { flex:1; padding:0.8rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-family:var(--font-sans); font-size:0.9rem; font-weight:500; cursor:pointer; transition:background 0.2s; }
  .mfl-modal-confirm:hover:not(:disabled) { background:var(--color-moss); }
  .mfl-modal-confirm:disabled { opacity:0.6; cursor:not-allowed; }
  .dark .mfl-modal-confirm { background:var(--color-moss); }
  .mfl-modal-cancel { flex:1; padding:0.8rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.15); background:transparent; color:var(--color-bark); font-family:var(--font-sans); font-size:0.9rem; cursor:pointer; transition:background 0.2s; }
  .mfl-modal-cancel:hover { background:rgba(44,36,25,0.05); }
  .dark .mfl-modal-cancel { border-color:rgba(255,255,255,0.12); color:#F5F0E8; }
`