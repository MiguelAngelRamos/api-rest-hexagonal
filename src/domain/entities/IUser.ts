// src/domian/entities/IUser.ts

export interface IUser {
  id?: string;
  username: string;
  passwordHash?: string;
  role?: string; // 'ADMIN', 'USER'
}