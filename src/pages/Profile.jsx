import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { updateUser, deleteUser } from '../api'
import toast from 'react-hot-toast'

function Profile() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      window.location.href = '/login'
      return
    }
    const u = JSON.parse(stored)
    setUser(u)
    setForm({
      name: u.name || '',
      email: u.email || '',
      height: u.height || '',
      weight: u.weight || '',
      goal: u.goal || 'maintain',
      activityLevel: u.activityLevel || 'moderate',
    })
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateUser(user.id, form)
      const newUser = { ...user, ...updated }
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setIsEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete your account? This cannot be undone.')) return
    try {
      await deleteUser(user.id)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Account deleted')
      window.location.href = '/'
    } catch (err) {
      toast.error('Failed to delete account')
    }
  }

  function handleCancel() {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      height: user?.height || '',
      weight: user?.weight || '',
      goal: user?.goal || 'maintain',
      activityLevel: user?.activityLevel || 'moderate',
    })
    setIsEditing(false)
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const activityLabels = {
    sedentary: 'Sedentary',
    light: 'Light (1–3 days/wk)',
    moderate: 'Moderate (3–5 days/wk)',
    active: 'Active (6–7 days/wk)',
    very: 'Very Active (daily)',
  }

  const goalLabels = {
    lose: 'Lose Weight',
    maintain: 'Maintain Weight',
    gain: 'Gain Muscle',
  }

  if (!user) return null

  return (
    <>
      <style>{`
        .profile-page { min-height:100vh; padding-top:64px; background:var(--color-cream); }
        .dark .profile-page { background:#0f0f0f; }
        .profile-inner { max-width:760px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .profile-h1 { font-family:var(--font-serif); font-size:clamp(1.6rem,3vw,2rem); font-weight:700; color:var(--color-bark); margin-bottom:0.3rem; }
        .dark .profile-h1 { color:#F5F0E8; }
        .profile-sub { font-size:0.875rem; font-weight:300; color:var(--color-warm-mid); margin-bottom:1.75rem; }
        .profile-avatar-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; padding:2rem; display:flex; align-items:center; gap:1.5rem; margin-bottom:1.25rem; }
        .dark .profile-avatar-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
        .profile-avatar-circle { width:72px; height:72px; border-radius:50%; background:var(--color-moss); display:flex; align-items:center; justify-content:center; font-size:1.6rem; font-weight:700; color:#fff; }
        .dark .profile-avatar-circle { background:var(--color-sage); color:var(--color-bark); }
        .profile-avatar-name { font-size:1.3rem; font-weight:700; color:var(--color-bark); margin-bottom:0.2rem; }
        .dark .profile-avatar-name { color:#F5F0E8; }
        .profile-avatar-email { font-size:0.85rem; color:var(--color-warm-mid); }
        .profile-avatar-goal { display:inline-flex; align-items:center; gap:0.3rem; margin-top:0.5rem; font-size:0.72rem; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; color:var(--color-moss); background:var(--color-sage-pale); padding:0.2rem 0.7rem; border-radius:100px; }
        .dark .profile-avatar-goal { color:var(--color-sage); background:rgba(59,109,17,0.12); }
        .profile-card { background:#fff; border:1px solid rgba(44,36,25,0.09); border-radius:20px; overflow:hidden; margin-bottom:1.25rem; }
        .dark .profile-card { background:#1a1a1a; border-color:rgba(255,255,255,0.07); }
        .profile-card-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid rgba(44,36,25,0.07); }
        .dark .profile-card-header { border-bottom-color:rgba(255,255,255,0.06); }
        .profile-card-title { font-size:1.05rem; font-weight:700; color:var(--color-bark); }
        .dark .profile-card-title { color:#F5F0E8; }
        .profile-edit-btn { padding:0.4rem 1rem; border-radius:100px; background:var(--color-sage-pale); border:1px solid rgba(59,109,17,0.15); font-size:0.78rem; font-weight:500; color:var(--color-moss); cursor:pointer; }
        .profile-edit-btn:hover { background:var(--color-sage-light); }
        .dark .profile-edit-btn { background:rgba(59,109,17,0.12); color:var(--color-sage); }
        .profile-fields { padding:1.25rem 1.5rem; }
        .profile-field { display:flex; align-items:center; justify-content:space-between; padding:0.8rem 0; border-bottom:1px solid rgba(44,36,25,0.06); gap:1rem; }
        .profile-field:last-child { border-bottom:none; }
        .dark .profile-field { border-bottom-color:rgba(255,255,255,0.05); }
        .profile-field-label { font-size:0.72rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-warm-mid); width:130px; flex-shrink:0; }
        .profile-field-value { font-size:0.9rem; color:var(--color-bark); flex:1; text-align:right; }
        .dark .profile-field-value { color:#F5F0E8; }
        .profile-input { width:100%; max-width:240px; padding:0.5rem 0.75rem; border-radius:10px; border:1.5px solid rgba(44,36,25,0.12); background:var(--color-cream); color:var(--color-bark); font-size:0.875rem; outline:none; text-align:right; }
        .profile-input:focus { border-color:var(--color-moss); }
        .dark .profile-input { background:#252525; border-color:rgba(255,255,255,0.1); color:#F5F0E8; }
        .profile-actions { display:flex; gap:0.75rem; padding:0 1.5rem 1.5rem 1.5rem; }
        .profile-save-btn { flex:1; padding:0.8rem; border-radius:100px; border:none; background:var(--color-bark); color:var(--color-cream); font-size:0.9rem; font-weight:500; cursor:pointer; }
        .profile-save-btn:hover:not(:disabled) { background:var(--color-moss); }
        .profile-save-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .dark .profile-save-btn { background:var(--color-moss); }
        .profile-cancel-btn { flex:1; padding:0.8rem; border-radius:100px; border:1.5px solid rgba(44,36,25,0.15); background:transparent; color:var(--color-bark); font-size:0.9rem; cursor:pointer; }
        .profile-cancel-btn:hover { background:rgba(44,36,25,0.04); }
        .dark .profile-cancel-btn { border-color:rgba(255,255,255,0.12); color:#F5F0E8; }
        .profile-danger { background:#fff; border:1.5px solid rgba(239,68,68,0.2); border-radius:20px; padding:1.25rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; }
        .dark .profile-danger { background:#1a1a1a; border-color:rgba(239,68,68,0.25); }
        .profile-danger-text h3 { font-size:1rem; font-weight:700; color:#ef4444; margin-bottom:0.2rem; }
        .profile-danger-text p { font-size:0.8rem; color:var(--color-warm-mid); }
        .profile-delete-btn { padding:0.6rem 1.25rem; border-radius:100px; border:1.5px solid #ef4444; background:transparent; color:#ef4444; font-size:0.875rem; font-weight:500; cursor:pointer; }
        .profile-delete-btn:hover { background:rgba(239,68,68,0.08); }
        @media (max-width:640px) {
          .profile-inner { padding:1.5rem 1rem 3rem; }
          .profile-avatar-card { flex-direction:column; text-align:center; }
          .profile-field { flex-direction:column; align-items:flex-start; gap:0.4rem; }
          .profile-field-label { width:auto; }
          .profile-field-value, .profile-input { text-align:left; max-width:100%; }
          .profile-danger { flex-direction:column; align-items:flex-start; }
          .profile-delete-btn { width:100%; text-align:center; }
        }
      `}</style>

      <div className="profile-page">
        <div className="profile-inner">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="profile-h1">Profile</h1>
            <p className="profile-sub">Manage your personal information and preferences</p>
          </motion.div>

          <motion.div className="profile-avatar-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <div className="profile-avatar-circle">{initials}</div>
            <div>
              <div className="profile-avatar-name">{user?.name}</div>
              <div className="profile-avatar-email">{user?.email}</div>
              <div className="profile-avatar-goal">🎯 {goalLabels[user?.goal] || 'Maintain Weight'}</div>
            </div>
          </motion.div>

          <motion.div className="profile-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
            <div className="profile-card-header">
              <span className="profile-card-title">Personal Information</span>
              {!isEditing && <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>}
            </div>

            <div className="profile-fields">
              {[
                { label: 'Full Name', name: 'name', type: 'text', value: isEditing ? form.name : user?.name },
                { label: 'Height (cm)', name: 'height', type: 'number', value: isEditing ? form.height : user?.height },
                { label: 'Weight (kg)', name: 'weight', type: 'number', value: isEditing ? form.weight : user?.weight },
              ].map(({ label, name, type, value }) => (
                <div className="profile-field" key={name}>
                  <span className="profile-field-label">{label}</span>
                  {isEditing ? (
                    <input type={type} name={name} value={form[name] || ''} onChange={handleChange} className="profile-input" />
                  ) : (
                    <span className="profile-field-value">{value || '—'}</span>
                  )}
                </div>
              ))}

              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{user?.email}</span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">Goal</span>
                {isEditing ? (
                  <select name="goal" value={form.goal} onChange={handleChange} className="profile-input">
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Muscle</option>
                  </select>
                ) : (
                  <span className="profile-field-value">{goalLabels[user?.goal] || '—'}</span>
                )}
              </div>

              <div className="profile-field">
                <span className="profile-field-label">Activity Level</span>
                {isEditing ? (
                  <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="profile-input">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light (1–3 days/wk)</option>
                    <option value="moderate">Moderate (3–5 days/wk)</option>
                    <option value="active">Active (6–7 days/wk)</option>
                    <option value="very">Very Active (daily)</option>
                  </select>
                ) : (
                  <span className="profile-field-value">{activityLabels[user?.activityLevel] || '—'}</span>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button className="profile-save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                <button className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            )}
          </motion.div>

          <motion.div className="profile-danger" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            <div className="profile-danger-text">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all associated data. This cannot be undone.</p>
            </div>
            <button className="profile-delete-btn" onClick={handleDelete}>Delete Account</button>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Profile