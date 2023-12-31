//* src/domain/repositries/IUserRepository
import { IUser } from '../entities/IUser';

export interface IUserRepository {
  findUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Omit<IUser, 'id'>): Promise<IUser>;
  updateUserImage(username: string, imageURL: string): Promise<void>;
}