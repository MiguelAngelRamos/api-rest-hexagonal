// src/domian/entities/IUser.ts
export interface IUser {
  id?: string;
  username: string;
  password?: string;
  role?: string; // 'ADMIN', 'USER'
}