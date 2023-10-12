import { RowDataPacket } from "mysql2";
import { IUser } from "../../domain/entities/IUser";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { MysqlConnection } from "../db/MysqlConnection";

export class MysqlUserRepository implements IUserRepository {

  constructor(private dbConnection: MysqlConnection) {}

  async findUserByUsername(username: string): Promise<IUser | null> {
    const conn = await this.dbConnection.getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE username = ?' , [username]) as unknown as [RowDataPacket[]];
      console.log(rows);
      if(rows.length > 0 ) {
        return rows[0] as IUser;
      }
      return null;
    } catch (error) {
      throw new Error("Error en la consulta" + error);
    } finally {
      conn.release();
    }
  }
  createUser(user: Omit<IUser, "id">): Promise<IUser> {
    throw new Error("Method not implemented.");
  }

}