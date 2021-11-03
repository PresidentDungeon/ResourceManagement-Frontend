import { Role } from "./role";

export interface User {
  ID: number
  username: string
  status: string
  role: Role
}
