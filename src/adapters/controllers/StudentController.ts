import {Request, Response, Router} from 'express';
import { DELETE, GET, POST, PUT, route } from 'awilix-express';
import { StudentService } from '../../application/service/StudentService';


@route('/students')
export class StudentController {
  public router: Router;
  constructor(private readonly studentService: StudentService) {
    this.router = Router();
    this.router.get('/', this.all.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
  }

@GET() //* http://localhost:3000/students
public async all(req: Request, res: Response) {
  const students = await this.studentService.getAllStudents();
  res.json(students);
}
//* http://localhost:3000/students/:id
@route('/:id')
@GET()
public async getById(req: Request, res: Response) {
  const id = Number(req.params.id); //* "1", "2", "3"
  const student = await this.studentService.getStudentById(id);

  if(student) {
    res.json(student);
  } else {
    res.status(404).send("Student not found");
  }
}
//* http://localhost:3000/students
@POST()
public async create(req: Request, res: Response) {
  const student = await this.studentService.createStudent(req.body);
  res.status(201).json(student);
}

}
