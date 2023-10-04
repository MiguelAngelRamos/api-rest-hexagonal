import { IStudent } from "../entities/IStudents";

export interface IStudentRepository {
  findAll(): Promise<IStudent[]>; 
  findById(id:number):Promise<IStudent | null>;
  create(student: Omit<IStudent, 'id'>):Promise<IStudent>;
  // Creamos un estudiante pero omitimos el id por que lo crea la bd auto-incremental
  update(id: number, student: Partial<IStudent>): Promise<IStudent>;
  // update(4, {name: 'Sofia Catalina'}); // actualizando solo el nombre
  // update(4, {age: 24 }); // actualizando solo la edad
  delete(id: number): Promise<void>;

}