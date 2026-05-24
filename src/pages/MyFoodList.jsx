import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getFoods, addFood } from '../api'
import toast from 'react-hot-toast'

const categories = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'bread', label: 'Breads', icon: '🍞' },
  { id: 'vegetable', label: 'Vegetables', icon: '🥦' },
  { id: 'protein', label: 'Protein', icon: '🍗' },
  { id: 'grain', label: 'Grains', icon: '🌾' },
  { id: 'rice', label: 'Rice', icon: '🍚' },
  { id: 'legume', label: 'Legumes', icon: '🫘' },
  { id: 'salad', label: 'Salads', icon: '🥗' },
  { id: 'main', label: 'Main Dishes', icon: '🍛' },
  { id: 'snack', label: 'Snacks', icon: '🍎' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
]

function MyFoodList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    category: 'snack'
  })
  const [saving, setSaving] = useState(false)

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoods()
        setFoods(data || [])
      } catch (err) {
        toast.error('Failed to load foods')
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [])

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/foods/${id}`, { method: 'DELETE' })
      setFoods(prev => prev.filter(food => food.id !== id))
      toast.success('Food deleted')
    } catch (err) {
      toast.error('Failed to delete food')
    }
  }

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.calories) {
      toast.error('Please fill in food name and calories')
      return
    }

    setSaving(true)
    try {
      const foodData = {
        name: newFood.name,
        calories: parseInt(newFood.calories),
        protein: parseInt(newFood.protein) || 0,
        carbs: parseInt(newFood.carbs) || 0,
        fat: parseInt(newFood.fat) || 0,
        category: newFood.category,
      }
      const added = await addFood(foodData)
      setFoods(prev => [...prev, added])
      setShowAddModal(false)
      setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '', category: 'snack' })
      toast.success('Food added!')
    } catch (err) {
      toast.error('Failed to add food')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="foodlist-page">
        <div className="foodlist-inner">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-8" />
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-6" />
            <div className="flex gap-2 mb-6">
              {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .foodlist-page {
          min-height: 100vh;
          padding-top: 64px;
          background: var(--color-cream);
        }
        .dark .foodlist-page {
          background: #0f0f0f;
        }
        .foodlist-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
        }

        .foodlist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .foodlist-title h1 {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-bark);
          margin-bottom: 0.3rem;
        }
        .dark .foodlist-title h1 { color: #F5F0E8; }
        .foodlist-title p {
          font-size: 0.875rem;
          color: var(--color-warm-mid);
        }
        .foodlist-add-btn {
          padding: 0.7rem 1.5rem;
          border-radius: 100px;
          background: var(--color-bark);
          color: var(--color-cream);
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .foodlist-add-btn:hover { background: var(--color-moss); }
        .dark .foodlist-add-btn {
          background: var(--color-moss);
          color: #fff;
        }

        .foodlist-search {
          margin-bottom: 1.5rem;
        }
        .foodlist-search input {
          width: 100%;
          padding: 0.9rem 1.2rem;
          border-radius: 60px;
          border: 1px solid rgba(44,36,25,0.1);
          background: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }
        .foodlist-search input:focus {
          border-color: var(--color-moss);
          box-shadow: 0 0 0 3px rgba(59,109,17,0.1);
        }
        .dark .foodlist-search input {
          background: #1a1a1a;
          border-color: rgba(255,255,255,0.1);
          color: #F5F0E8;
        }

        .foodlist-categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .foodlist-cat-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          background: #fff;
          border: 1px solid rgba(44,36,25,0.1);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dark .foodlist-cat-btn {
          background: #1a1a1a;
          border-color: rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .foodlist-cat-btn.active {
          background: var(--color-bark);
          border-color: var(--color-bark);
          color: var(--color-cream);
        }
        .dark .foodlist-cat-btn.active {
          background: var(--color-moss);
          border-color: var(--color-moss);
          color: #fff;
        }

        .foodlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .foodlist-card {
          background: #fff;
          border: 1px solid rgba(44,36,25,0.09);
          border-radius: 16px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
        }
        .foodlist-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44,36,25,0.1);
        }
        .dark .foodlist-card {
          background: #1a1a1a;
          border-color: rgba(255,255,255,0.07);
        }
        .foodlist-card-info {
          flex: 1;
        }
        .foodlist-card-name {
          font-weight: 600;
          color: var(--color-bark);
          margin-bottom: 0.25rem;
        }
        .dark .foodlist-card-name { color: #F5F0E8; }
        .foodlist-card-macros {
          display: flex;
          gap: 0.75rem;
          font-size: 0.7rem;
          color: var(--color-warm-mid);
        }
        .foodlist-card-calories {
          font-weight: 600;
          color: var(--color-moss);
        }
        .dark .foodlist-card-calories { color: var(--color-sage); }
        .foodlist-card-delete {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.5;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .foodlist-card-delete:hover {
          opacity: 1;
          background: rgba(239,68,68,0.1);
        }

        .foodlist-empty {
          text-align: center;
          padding: 3rem;
          color: var(--color-warm-mid);
        }

        /* Modal */
        .foodlist-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(44,36,25,0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        .foodlist-modal {
          background: var(--color-cream);
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 480px;
        }
        .dark .foodlist-modal {
          background: #1a1a1a;
        }
        .foodlist-modal-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-bark);
          margin-bottom: 1.25rem;
        }
        .dark .foodlist-modal-title { color: #F5F0E8; }
        .foodlist-modal-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1.5px solid rgba(44,36,25,0.12);
          background: #fff;
          color: var(--color-bark);
          font-size: 0.9rem;
          outline: none;
          margin-bottom: 1rem;
        }
        .foodlist-modal-input:focus {
          border-color: var(--color-moss);
          box-shadow: 0 0 0 3px rgba(59,109,17,0.1);
        }
        .dark .foodlist-modal-input {
          background: #252525;
          border-color: rgba(255,255,255,0.1);
          color: #F5F0E8;
        }
        .foodlist-modal-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .foodlist-modal-select {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1.5px solid rgba(44,36,25,0.12);
          background: #fff;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .foodlist-modal-actions {
          display: flex;
          gap: 0.75rem;
        }
        .foodlist-modal-confirm {
          flex: 1;
          padding: 0.8rem;
          border-radius: 100px;
          border: none;
          background: var(--color-bark);
          color: var(--color-cream);
          font-weight: 500;
          cursor: pointer;
        }
        .dark .foodlist-modal-confirm { background: var(--color-moss); }
        .foodlist-modal-cancel {
          flex: 1;
          padding: 0.8rem;
          border-radius: 100px;
          border: 1.5px solid rgba(44,36,25,0.15);
          background: transparent;
          color: var(--color-bark);
          cursor: pointer;
        }
        .dark .foodlist-modal-cancel {
          border-color: rgba(255,255,255,0.12);
          color: #F5F0E8;
        }

        @media (max-width: 640px) {
          .foodlist-inner { padding: 1rem 1rem 3rem; }
          .foodlist-header { flex-direction: column; align-items: flex-start; }
          .foodlist-modal-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="foodlist-page">
        <div className="foodlist-inner">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="foodlist-header"
          >
            <div className="foodlist-title">
              <h1>My Food List</h1>
              <p>Your personal collection of favorite foods</p>
            </div>
            <button className="foodlist-add-btn" onClick={() => setShowAddModal(true)}>
              + Add Food
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="foodlist-search"
          >
            <input
              type="text"
              placeholder="🔍 Search for a food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="foodlist-categories"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`foodlist-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="foodlist-grid"
          >
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <div key={food.id} className="foodlist-card">
                  <div className="foodlist-card-info">
                    <div className="foodlist-card-name">{food.name}</div>
                    <div className="foodlist-card-macros">
                      <span>💪 {food.protein}g</span>
                      <span>🍚 {food.carbs}g</span>
                      <span>🥑 {food.fat}g</span>
                    </div>
                    <div className="foodlist-card-macros" style={{ marginTop: '0.2rem' }}>
                      <span className="foodlist-card-calories">{food.calories} kcal</span>
                      <span>per 100g</span>
                    </div>
                  </div>
                  <button className="foodlist-card-delete" onClick={() => handleDelete(food.id)}>✕</button>
                </div>
              ))
            ) : (
              <div className="foodlist-empty">
                <span>🍽️ No foods found</span>
                <div><button className="foodlist-add-btn" style={{ marginTop: '1rem' }} onClick={() => setShowAddModal(true)}>Add your first food</button></div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="foodlist-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <motion.div className="foodlist-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="foodlist-modal-title">Add New Food</div>
            <input
              type="text"
              className="foodlist-modal-input"
              placeholder="Food name"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            />
            <input
              type="number"
              className="foodlist-modal-input"
              placeholder="Calories (per 100g)"
              value={newFood.calories}
              onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
            />
            <div className="foodlist-modal-row">
              <input type="number" placeholder="Protein (g)" value={newFood.protein} onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })} className="foodlist-modal-input" style={{ marginBottom: 0 }} />
              <input type="number" placeholder="Carbs (g)" value={newFood.carbs} onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })} className="foodlist-modal-input" style={{ marginBottom: 0 }} />
              <input type="number" placeholder="Fat (g)" value={newFood.fat} onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })} className="foodlist-modal-input" style={{ marginBottom: 0 }} />
            </div>
            <select className="foodlist-modal-select" value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}>
              <option value="bread">Breads</option>
              <option value="vegetable">Vegetables</option>
              <option value="protein">Protein</option>
              <option value="grain">Grains</option>
              <option value="rice">Rice</option>
              <option value="legume">Legumes</option>
              <option value="salad">Salads</option>
              <option value="main">Main Dishes</option>
              <option value="snack">Snacks</option>
              <option value="breakfast">Breakfast</option>
            </select>
            <div className="foodlist-modal-actions">
              <button className="foodlist-modal-confirm" onClick={handleAddFood} disabled={saving}>{saving ? 'Adding...' : 'Add Food'}</button>
              <button className="foodlist-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default MyFoodList