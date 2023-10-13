import { IUser } from "../../domain/entities/IUser";
import { IAuthService } from "../../domain/services/IAuthService";
import sha from 'sha.js';
import jwt from 'jsonwebtoken';
import { IUserRepository } from "../../domain/repositories/IUserRepository";
export class AuthService implements IAuthService{
  
  private readonly jwtSecret: string;

  constructor(private userRepository: IUserRepository) {

    this.jwtSecret = process.env.JWT_SECRET || 'academy-node';
  }
  validateToken(token: string): IUser {
    try {
      const user = jwt.verify(token, this.jwtSecret) as IUser;
      return user;
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
  validateRole(user: IUser, requiredRole: string): boolean {
    throw new Error("Method not implemented.");
  }

  hashPassword(password: string): string {
   try {
    const hashedPassword = sha('sha256').update(password).digest('hex');
    return hashedPassword;
   } catch (error) {
    throw new Error('Error hashing password.')
   }
  }

  generateToken(user: IUser): string {
    try {
      const token = jwt.sign(
        {id: user.id, username: user.username , role: user.role},
        this.jwtSecret,
        {expiresIn: '1h'}
      );
      return token;
    } catch (error) {
      throw new Error("Error generating token.")
    }
  }
  async validateUserCredentials(username: string, password: string): Promise<IUser | null> {
     try {
      const hashedPassword = this.hashPassword(password);
      const user = await this.userRepository.findUserByUsername(username);

      if(user && user.passwordHash === hashedPassword) {
        return user;
      }
      return null;

     } catch (error) {
      throw new Error('Error validating user credentials');
     }
  }
  async registerUser(user: IUser): Promise<void> {
    try {
      //* Validar si el usuario ya existe
      // console.log(user);
      const existingUser = await this.userRepository.findUserByUsername(user.username);
      // console.log(existingUser);
      if(existingUser) {
        throw new Error("Username already taken.")
      }

      //* Guardar el usuario
      await this.userRepository.createUser(user);
    } catch (error) {
      throw new Error("Error al registering user.");
    }
  }

}