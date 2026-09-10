import type { User } from '~/types/user'

export const seedUsers: User[] = [
  { id: 'u1', username: 'alice', password: '1234', displayName: 'Alice', color: '#f97316', createdAt: new Date().toISOString() },
  { id: 'u2', username: 'bob', password: '1234', displayName: 'Bob', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: 'u3', username: 'carol', password: '1234', displayName: 'Carol', color: '#10b981', createdAt: new Date().toISOString() },
]