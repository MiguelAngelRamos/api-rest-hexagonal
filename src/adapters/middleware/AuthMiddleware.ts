import { NextFunction, Request, Response } from 'express';
import { AuthService } from "../../application/service/AuthService";

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization as string; //* Aseguramos de que el token sea un string

    if(!authHeader) {
      throw new Error("El token es necesario");
    }
   //* Bearer 838hjfehfeh1937439f91hfs2313242feffasdfefe3434141f
   //* [Bearer, 838hjfehfeh1937439f91hfs2313242feffasdfefe3434141f]
    const token = authHeader.split(' ')[1];
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