import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IStudent } from "../../domain/entities/IStudents";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { MysqlConnection } from "../db/MysqlConnection";

export class MysqlStudentRepository implements IStudentRepository {

  constructor(private readonly dbConnection: MysqlConnection) {}

  private async getConnection() {
    return this.dbConnection.getConnection();
  }

  async findAll(): Promise<IStudent[]> {
    const connection = await this.getConnection();

    try {
      const [rows] = await connection.execute('SELECT * FROM students');
      return rows as IStudent[];
    } finally {
      connection.release(); //* liberar la conexion
    }
   
  }

  async findById(id: number): Promise<IStudent | null> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM students WHERE id = ?', [id]);

      if (rows.length === 0) {
        return null;
      }
      return rows[0] as unknown as IStudent;
    } finally {
      connection.release(); //* liberar la conexion
    }

  }
  
   //* { name: "antonio", age: 20 }
  
  async create(student: Omit<IStudent, "id">): Promise<IStudent> {
    const connection = await this.getConnection();

    try {
      const [result] = await connection.execute<ResultSetHeader>('INSERT INTO students (name, age) VALUES (?, ?)', [student.name, student.age]);
      const id = result.insertId; // *obtenemos el id autoincremental que creo la base de datos.
      return {id, ...student} as IStudent;
    } finally {
      connection.release(); // Libera la conexión
    }
   
  }

  async update(id: number, student: Partial<IStudent>): Promise<IStudent> {
    const connection = await this.getConnection();
    try {
      //* Verificar que el estudiante exista antes de intentar actualizarlo
      const existingStudent = await this.findById(id);
      // updatedStundent existe true (!true) => false
      //* updatedStundent no existe false (!false) => true
      if (!existingStudent) {
        throw new Error('Student not found');
      }
      await connection.execute('UPDATE students SET name = ?, age = ? WHERE id = ?', [student.name, student.age, id]);
      const updatedStudent = await this.findById(id);

      if (!updatedStudent) {
        throw new Error('Student not found');
      }
      return updatedStudent;

      // const [result] = await connection.execute<ResultSetHeader>("UPDATE students SET name = ?, age = ? WHERE id = ?", [student.name, student.age, id]);
      //  return result as unknown as IStudent;
    } finally {
      connection.release(); //* Libera la conexión
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await this.getConnection();
    try {
      //* Comprobar si el registro existe
      const [rows] = await connection.execute<RowDataPacket[]>('SELECT id FROM students WHERE id = ?', [id]);
      if (rows.length === 0) {
        throw new Error(`Student with ID ${id} not found`);
      }
      await connection.execute('DELETE FROM students WHERE id = ?', [id]);
    } finally {
      connection.release(); //* Libera la conexión
    }

  }
}

//* Liberar la conexion para mejorar el performance, del pool de conexiones