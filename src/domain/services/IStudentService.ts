import { IStudent } from "../entities/IStudents";

export interface IStudentService {
  getAllStudents(): Promise<IStudent[]>;
  getStudentById(id: number): Promise<IStudent | null>
  createStudent(student: Omit<IStudent, 'id'>): Promise<IStudent>;
  updateStudent(id: number, student: Partial<IStudent>):Promise<IStudent>;
  deleteStudent(id: number):Promise<void>;
}