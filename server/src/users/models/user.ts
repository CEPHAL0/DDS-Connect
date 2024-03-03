import { roles } from "../entitites/user.entity"


export class User{
    id: number
    username: string
    password: string
    role: roles
}