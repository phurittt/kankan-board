export interface User {
  id: string
  username: string
  password: string
  displayName: string
  color: string
  createAt: string
}

export interface Session {
  currentUserId: string | null
}
