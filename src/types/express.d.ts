import { IUser } from "../domain/entities/IUser";

declare module 'express' {
  export interface Request {
    user?: IUser
  }
}