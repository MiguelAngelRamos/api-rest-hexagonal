// src/application/service/AuthService.ts
import { IUser } from "../../domain/entities/IUser";
import { IAuthService } from "../../domain/services/IAuthService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import sha from 'sha.js';
import jwt from 'jsonwebtoken';
export class AuthService implements IAuthService{
  
  private readonly jwtSecret: string;

  constructor(private userRepository: IUserRepository) {

    this.jwtSecret = process.env.JWT_SECRET || 'academy-node';
  }
  validateToken(token: string): IUser {
    try {
      const user = jwt.verify(token, this.jwtSecret) as IUser;
      console.log(user);
      return user;
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
  validateRole(user: IUser, requiredRole: string): boolean {
    if(!user.role) {
      throw new Error("User role is not defined");
    }

    //* requiredRole 'ADMIN'
    //* user.role  'ADMIN'
    return user.role === requiredRole; // * false
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
        {
          id: user.id, 
          username: user.username, 
          role: user.role
        },
        this.jwtSecret,
        {
          expiresIn: '1h'
        }
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
    
      if(user && user.password === hashedPassword) {
        return user;
      }
      return null;

     } catch (error) {
      throw new Error('Error validating user credentials' + error);
     }
  }
  async registerUser(user: IUser): Promise<void> {
    try {
      //* Validar si el usuario ya existe
      const existingUser = await this.userRepository.findUserByUsername(user.username);
      
      if(existingUser) {
        throw new Error("Username already taken.")
      }

      //* Guardar el usuario
      await this.userRepository.createUser(user);
    } catch (error) {
      // console.log(error)
      throw new Error("Error al registering user.");
    }
  }

}