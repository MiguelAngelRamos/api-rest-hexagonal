//* src /infraestructure/repositories/MysqlUserRepository
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IUser } from "../../domain/entities/IUser";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { MysqlConnection } from "../db/MysqlConnection";

export class MysqlUserRepository implements IUserRepository {

  constructor(private dbConnection: MysqlConnection) {
    console.log('MysqlUserRepository')
  }

  public async findUserByUsername(username: string): Promise<IUser | null> {
    console.log(username);
    const conn = await this.dbConnection.getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM users2 WHERE username = ?' , [username]) as unknown as [RowDataPacket[]];
      console.log(rows);
      if(rows.length > 0 ) {
        return rows[0] as IUser;
      }
      return null;
    } finally {
      conn.release();
    }
  }
  public async createUser(user: Omit<IUser, 'id'>): Promise<IUser> {
    const conn = await this.dbConnection.getConnection();

    try {
      const [result] = await conn.query<ResultSetHeader>('INSERT INTO users2 (username, password_hash) VALUES(?,?)', [user.username, user.passwordHash]);
      console.log(result);
      const id = result.insertId;

      return {
        id: id.toString(),
        username: user.username
      }
    }  finally {
      conn.release();
    }
  }

}