import client from './client'

export async function getProfile() {
  const { data } = await client.get('/users/me')
  return data
}

export async function updateProfile(payload) {
  const { data } = await client.put('/users/me', payload)
  return data
}
