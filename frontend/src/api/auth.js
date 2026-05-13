import client from './client'

export async function login(credentials) {
  const { data } = await client.post('/auth/login', credentials)
  return data
}

export async function register(payload) {
  const { data } = await client.post('/auth/register', payload)
  return data
}
