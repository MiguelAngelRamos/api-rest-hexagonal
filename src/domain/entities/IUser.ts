export interface IUser {
  id?: string;
  username: string;
  passwordHash: string;
  role?: string; // 'ADMIN', 'USER'
}