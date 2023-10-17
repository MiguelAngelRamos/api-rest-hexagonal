import express from 'express';
import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import config from './config';
import { MysqlConnection } from './infrastructure/db/MysqlConnection';
import { MysqlStudentRepository } from './infrastructure/repositories/MysqlStudentRepository';
import { StudentService } from './application/service/StudentService';
import { StudentController } from './adapters/controllers/StudentController';
import { AuthService } from './application/service/AuthService';
import { UserController } from './adapters/controllers/UserController';
import { MysqlUserRepository } from './infrastructure/repositories/MysqlUserRepository';
import { AuthMiddleware } from './adapters/middleware/AuthMiddleware';

const app = express();

//* Creamos el contenedor
const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});
//* Estamos registrando dentro del contenedor.
container.register({
  dbConfig: asValue(config.dbConfig),
  dbConnection: asClass(MysqlConnection).singleton(),
  //* Repositories
  studentRepository: asClass(MysqlStudentRepository).scoped(),
  userRepository: asClass(MysqlUserRepository).scoped(),
  //* Servicios
  studentService: asClass(StudentService).scoped(),
  authService: asClass(AuthService).scoped(),
  //* Controladores
  studentController: asClass(StudentController).scoped(),
  userController: asClass(UserController).scoped(),
  //* Middleware
  authMiddleware: asClass(AuthMiddleware).scoped(),
});

app.use(scopePerRequest(container));
app.use(express.json());
//* localhost:3000/students
app.use('/students', (req, res, next) => {
  container.resolve('studentController').router(req, res, next);
});

app.use('/users', (req, res, next) => {
  container.resolve('userController').router(req, res, next);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server esta corriendo en: http://localhost:${PORT}`);
});