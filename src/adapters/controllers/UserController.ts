import { POST, route } from "awilix-express";
import { Request, Response, Router } from "express";
import { AuthService } from "../../application/service/AuthService";
import { IUser } from "../../domain/entities/IUser";

@route('/users') //* localhost:3000/users
export class UserController {
  public router: Router;

  constructor(private readonly authService: AuthService) {
    this.router = Router();
    //* localhost:3000/users/login
    this.router.post('/login', this.login.bind(this));
    this.router.post('/register', this.register.bind(this))
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

  @POST()
  @route('/register')
  public async register (req: Request, res: Response ) {
    try {
      const { username, password } = req.body;
      // console.log(username)
      // console.log(password)
      
      if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required'});
      }

      const hashedPassword = this.authService.hashPassword(password);

      const newUser: IUser = {
        username: username,
        passwordHash: hashedPassword
      };
      console.log(newUser);
      await this.authService.registerUser(newUser);
      return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
      return res.status(500).json({error: 'Internal Server error'});
    }
  }
 

}