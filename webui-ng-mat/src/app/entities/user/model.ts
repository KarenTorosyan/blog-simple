export interface User {
  id: string
  name: string
  familyName: string
  email: Email
  picture: Picture | null
}

export interface Email {
  address: string
  verified: boolean
}

export interface Picture {
  url: string
}

export interface UserEditRequest {
  name: string
  familyName: string
}

export interface ChangePasswordRequest {
  current: string
  new: string
  confirmNew: string
}
