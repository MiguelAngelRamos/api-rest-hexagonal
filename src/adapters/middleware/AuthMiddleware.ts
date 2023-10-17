import { NextFunction, Request, Response } from 'express';
import { AuthService } from "../../application/service/AuthService";

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string; //* Aseguramos de que el token sea un string

    try {
      const userPayload = this.authService.validateToken(token);
      req.user = userPayload;
      next(); //* sigue hacia el StudentController
    } catch (error) {
      res.status(401).send('401 Unauthorized');
    }
  }

  public authorizeRole(requiredRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if(!req.user || !this.authService.validateRole(req.user, requiredRole)) {
        return res.status(403).send('Forbidden');
      }
      next();
    }
  }
}