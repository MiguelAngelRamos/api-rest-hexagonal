import mysql, { Connection  } from 'mysql2/promise';

export class MysqlConnection {
  private connection: Connection | null = null;
  // Private connection!: Connection;
  constructor(private dbConfig: mysql.ConnectionOptions) {}

  async getConnection(): Promise<Connection> {
    try {
      if(this.connection) return this.connection;
      this.connection = await mysql.createConnection(this.dbConfig);
      console.log('Conexion a Mysql exitosa!');
      return this.connection;
    } catch (error) {
      console.log('Error al establecer la conexion: ', error);
      throw error;
    }
  }
}