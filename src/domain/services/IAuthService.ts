import { IUser } from "../entities/IUser";

export interface IAuthService {
  validateToken(token: string): IUser;
  validateRole(user: IUser, requiredRole: string): boolean;
  hashPassword(password: string): string;
  generateToken(user: IUser): string;
  validateUserCredentials(username: string, password: string): Promise<IUser | null>;
  registerUser(user: IUser): Promise<void>;
}