import { Role } from "./role";
import { Status } from "./status";

export interface User {
  ID: number
  username: string
  status: Status
  role: Role
}
