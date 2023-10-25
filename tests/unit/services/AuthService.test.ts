import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/application/service/AuthService';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { IUser } from '../../../src/domain/entities/IUser';

//* Mock del repositorio de usuarios
const mockUserRepository: IUserRepository = {
  findUserByUsername: jest.fn(),
  createUser: jest.fn(),
}

//* Mock del usuario
const mockUser: IUser = {
  id: '1',
  username: 'usuario',
  password: 'password',
  role: 'USER'
}
const authService = new AuthService(mockUserRepository);
describe('AuthService', () => {

  describe('validateToken', () => {
    it('should validate a valid JWT token correctly', async () => {
      //* Simular un token JWT válido y verifica si se valida correctamente
      const invalidToken = 'un-token-jwt';

      //* Configura el comportamiento del mock para lanzar un error verificar el token
      jest.spyOn(jwt,'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.validateToken(invalidToken)).toThrowError('Invalid token');
    })
  });

  describe('validateRole', () => {

    it('should validate a specific user role correctly', async () => {
      //* Simular un usuario con un rol especifico y verificar si se valida el rol correctamente
      const user:IUser = {id: '1', 'username': 'usuario', role: 'ADMIN'};
      const requiredRole = 'ADMIN';
      const result = await authService.validateRole(user, requiredRole);
      expect(result).toBe(true);
    });

    it('should throw an error if user role is not defined', () => {
      const user:IUser = {id: '1', 'username': 'usuario'};
      const requiredRole = 'ADMIN';

      expect(() => authService.validateRole(user, requiredRole)).toThrowError('User role is not defined.')
    });

    it('should return false if user role does not match required role', async () => {
      const user:IUser = {id: '1', 'username': 'usuario', role: 'ADMIN'};
      const requiredRole = 'USER';
      const result = await authService.validateRole(user, requiredRole);
      expect(result).toBe(false);
    });

  });

  describe('validateUserCredentials', () => {
    it('should validate user credentials correctly', async () => {
      const username = 'usuario';
      const password = 'password';
      //* Simular que findUserByUsername devuelve un usuario con contraseña hasheada
      (mockUserRepository.findUserByUsername as jest.Mock).mockResolvedValue(mockUser);

      //* Simular que hashPassword devuelve la contraseña hasheada correctamente
      jest.spyOn(authService, 'hashPassword').mockReturnValue('password');

      //* Simula que hashPassword devuelve un usuario con una contraseña hasheada incorrectamente
      // jest.spyOn(authService, 'hashPassword').mockReturnValue('wrong-hashed-password');

      const result = await authService.validateUserCredentials(username, password);
      console.log(result);
      expect(result).toEqual(mockUser);

    })
  });
});