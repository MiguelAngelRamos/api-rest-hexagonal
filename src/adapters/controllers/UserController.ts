import { POST, route } from "awilix-express";
import { Request, Response, Router } from "express";
import { AuthService } from "../../application/service/AuthService";

@route('/users') //* localhost:3000/users
export class UserController {
  public router: Router;

  constructor(private readonly authService: AuthService) {
    this.router = Router();
    //* localhost:3000/users/login
    this.router.post('/login', this.login.bind(this));
  }

  @POST()
  @route('/login')
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const user = await this.authService.validateUserCredentials(username, password);
      if(!user) {
        return res.status(401).json({error: 'Invalid credentials'});
      }
      const token = this.authService.generateToken(user);
      return res.json({token: token});
      // return res.json({token});
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server error'});
    }
  }
}