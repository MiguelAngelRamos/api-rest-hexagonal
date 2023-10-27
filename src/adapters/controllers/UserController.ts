// src/adapters/controllers/UserController.ts
import { POST, route } from "awilix-express";
import { Request, Response, Router } from "express";
import { AuthService } from "../../application/service/AuthService";
import { IUser } from "../../domain/entities/IUser";
import multer from 'multer';
@route('/users') //* localhost:3000/users
export class UserController {

  public router: Router;

  private storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'static/')
    },
    filename: function(req, file, cb ) {
      //* sofia.jpg
      const fileExtension = file.originalname.split('.').pop();
                               //* ["sofia", "jpg"]

      //* fileExtesion = jpg
      //* 18398419384918493849148.jpg
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`);
    }
  });

  private upload = multer({storage: this.storage});

  constructor(private readonly authService: AuthService) {
    this.router = Router();
    //* localhost:3000/users/login
    this.router.post('/login', this.login.bind(this));
    this.router.post('/register', this.register.bind(this));
    this.router.post('/update-image/:username', this.updateImage.bind(this));
  }

  @POST()
  @route('/login')  //* localhost:3000/users/login
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
  @route('/register')  //* localhost:3000/users/register
  public async register (req: Request, res: Response ) {
    try {
      const { username, password, role } = req.body;
   
      if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required'});
      }
      //* encriptamos la contraseña (password)
      const hashedPassword = this.authService.hashPassword(password);

      const newUser: IUser = {
        username: username,
        password: hashedPassword,
        role: role
      };
      // const newUser: IUser = {
      //   username,
      //   passwordHash: hashedPassword,
      //   role
      // };
  
      await this.authService.registerUser(newUser);
      return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: 'Internal Server error'});
    }
  }
 
  @POST()
  @route('/update-image/:username')
  public async updateImage(req: Request, res: Response) {
    const { username } = req.params;

    this.upload.single('image')(req,res, async (err) => {

      if(err) {
        return res.status(500).json({error: 'Error uploading image.'})
      }

      if(!req.file || !req.file.filename) {
        return res.status(400).json({error: 'image is required for updating'})
      }

      const imageURL = `/static/${req.file.filename}`;

      try {
        await this.authService.updatedUserImageService(username, imageURL);
        return res.status(200).json({message: 'Image updated successfully', imageURL: imageURL})
      } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
      }

    })
  }
}