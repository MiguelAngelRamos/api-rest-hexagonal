import { IStudent } from "../../domain/entities/IStudents";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { IStudentService } from "../../domain/services/IStudentService";

export class StudentService implements IStudentService {

  constructor(private readonly studentRepository: IStudentRepository) {}

  getAllStudents(): Promise<IStudent[]> {
    return this.studentRepository.findAll();
  }
  getStudentById(id: number): Promise<IStudent | null> {
    return this.studentRepository.findById(id);
  }
  createStudent(student: Omit<IStudent, "id">): Promise<IStudent> {
    return this.studentRepository.create(student);
  }
  updateStudent(id: number, student: Partial<IStudent>): Promise<IStudent> {
    return this.studentRepository.update(id, student);
  }
  deleteStudent(id: number): Promise<void> {
    return this.studentRepository.delete(id);
  }
}
