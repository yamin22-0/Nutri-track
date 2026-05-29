const BASE = 'http://localhost:3001'

// ── AUTH ──────────────────────────────────────────

export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/users?email=${encodeURIComponent(email)}`)
  const users = await res.json()
  if (users.length === 0) throw new Error('No account found with that email')
  const user = users[0]
  if (user.password !== password) throw new Error('Incorrect password')
  return user
}

export async function registerUser(data) {
  const check = await fetch(`${BASE}/users?email=${encodeURIComponent(data.email)}`)
  const existing = await check.json()
  if (existing.length > 0) throw new Error('Email already registered')

  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      height: data.height || '',
      weight: data.weight || '',
      goal: data.goal || 'maintain',
      createdAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error('Registration failed')
  const user = await res.json()

  const today = new Date().toISOString().split('T')[0]

  const sampleMeals = [
    { userId: user.id, name: 'Chapati with Sukuma Wiki',    calories: 450, protein: 12, carbs: 65, fat: 15, mealType: 'breakfast', date: today },
    { userId: user.id, name: 'Nyama Choma with Kachumbari', calories: 580, protein: 42, carbs: 8,  fat: 28, mealType: 'lunch',     date: today },
    { userId: user.id, name: 'Pilau with Beef',             calories: 620, protein: 28, carbs: 75, fat: 22, mealType: 'dinner',    date: today },
    { userId: user.id, name: 'Mandazi',                     calories: 250, protein: 4,  carbs: 35, fat: 10, mealType: 'snack',     date: today },
  ]

  for (const meal of sampleMeals) {
    await fetch(`${BASE}/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    })
  }

  await fetch(`${BASE}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      dailyCalories: 2200,
      protein: 140,
      carbs: 250,
      fat: 55,
      water: 2500,
      targetWeight: 70,
      createdAt: new Date().toISOString(),
    }),
  })

  return user
}

// ── MEALS ─────────────────────────────────────────

export async function getMeals(userId, date = null) {
  let url = `${BASE}/meals?userId=${userId}`
  if (date) url += `&date=${date}`
  const res = await fetch(url)
  return res.json()
}

export async function addMeal(meal) {
  const res = await fetch(`${BASE}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...meal, createdAt: new Date().toISOString() }),
  })
  return res.json()
}

// PATCH — partial update (one or more fields)
export async function updateMeal(id, data) {
  const res = await fetch(`${BASE}/meals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// PUT — full replacement
export async function replaceMeal(id, data) {
  const res = await fetch(`${BASE}/meals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteMeal(id) {
  await fetch(`${BASE}/meals/${id}`, { method: 'DELETE' })
}

// ── GOALS ─────────────────────────────────────────

export async function getGoals(userId) {
  const res = await fetch(`${BASE}/goals?userId=${userId}`)
  const goals = await res.json()
  return goals[0] || null
}

export async function saveGoal(goal) {
  const res = await fetch(`${BASE}/goals?userId=${goal.userId}`)
  const existing = await res.json()

  if (existing.length > 0) {
    const update = await fetch(`${BASE}/goals/${existing[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    })
    return update.json()
  }

  const create = await fetch(`${BASE}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })
  return create.json()
}

// PUT — full goal replacement
export async function replaceGoal(id, goal) {
  const res = await fetch(`${BASE}/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })
  return res.json()
}

// ── USER ─────────────────────────────────────────

export async function updateUser(userId, data) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// PUT — full user replacement
export async function replaceUser(userId, data) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteUser(userId) {
  const mealsRes = await fetch(`${BASE}/meals?userId=${userId}`)
  const meals = await mealsRes.json()
  for (const meal of meals) {
    await fetch(`${BASE}/meals/${meal.id}`, { method: 'DELETE' })
  }
  const goalsRes = await fetch(`${BASE}/goals?userId=${userId}`)
  const goals = await goalsRes.json()
  for (const goal of goals) {
    await fetch(`${BASE}/goals/${goal.id}`, { method: 'DELETE' })
  }
  await fetch(`${BASE}/users/${userId}`, { method: 'DELETE' })
}

// ── FOODS ─────────────────────────────────────────

export async function getFoods(query = '') {
  const url = query
    ? `${BASE}/foods?name_like=${encodeURIComponent(query)}`
    : `${BASE}/foods`
  const res = await fetch(url)
  return res.json()
}

export async function addFood(food) {
  const res = await fetch(`${BASE}/foods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(food),
  })
  return res.json()
}

// PATCH — partial food update
export async function updateFood(id, data) {
  const res = await fetch(`${BASE}/foods/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// PUT — full food replacement
export async function replaceFood(id, data) {
  const res = await fetch(`${BASE}/foods/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteFood(id) {
  await fetch(`${BASE}/foods/${id}`, { method: 'DELETE' })
}