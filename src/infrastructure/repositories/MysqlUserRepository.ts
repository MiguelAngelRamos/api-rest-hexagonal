//* src /infraestructure/repositories/MysqlUserRepository
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IUser } from "../../domain/entities/IUser";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { MysqlConnection } from "../db/MysqlConnection";

export class MysqlUserRepository implements IUserRepository {

  constructor(private dbConnection: MysqlConnection) {
   
  }

  public async findUserByUsername(username: string): Promise<IUser | null> {

    const conn = await this.dbConnection.getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE username = ?' , [username]) as unknown as [RowDataPacket[]];
     
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
      const [result] = await conn.query<ResultSetHeader>(
        'INSERT INTO users (username, password, role) VALUES(?,?,?,?)', 
        [user.username, user.password, user.role, user.imageURL]);
   
      const id = result.insertId;

      return {
        id: id.toString(),
        username: user.username,
        imageURL: user.imageURL
      }
    }  finally {
      conn.release();
    }
  }

  //* Añadimos una imagen para aquellos que no agregan imagen en su registro
  async updateUserImage(username: string, imageURL: string): Promise<void> {
    const conn = await this.dbConnection.getConnection();

    try {
      await conn.query('UPDATE users SET imageURL = ? WHERE username = ?', [imageURL, username]);
    } catch (error) {
      conn.release();
    }
  }


}