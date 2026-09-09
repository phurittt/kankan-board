export interface User {
  id: string
  username: string
  password: string
  displayName: string
  color: string
  createdAt: string
}

export interface Session {
  currentUserId: string | null
}
