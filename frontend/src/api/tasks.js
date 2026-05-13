import client from './client'

export async function getTasks(filters = {}) {
  const params = {}
  if (filters.status) params.status = filters.status
  if (filters.category) params.category = filters.category
  if (filters.priority) params.priority = filters.priority
  const { data } = await client.get('/tasks', { params })
  return data
}

export async function getTaskStats() {
  const { data } = await client.get('/tasks/stats')
  return data
}

export async function getTask(id) {
  const { data } = await client.get(`/tasks/${id}`)
  return data
}

export async function createTask(task) {
  const { data } = await client.post('/tasks', task)
  return data
}

export async function updateTask(id, task) {
  const { data } = await client.put(`/tasks/${id}`, task)
  return data
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`)
}

export async function markComplete(id) {
  const { data } = await client.patch(`/tasks/${id}/complete`)
  return data
}

export async function markInProgress(id) {
  const { data } = await client.patch(`/tasks/${id}/in-progress`)
  return data
}
