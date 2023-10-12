import mysql, { Pool } from 'mysql2/promise';

export class MysqlConnection {
  // private connection: Connection | null = null;
  private pool: Pool;
  // Private connection!: Connection;
  constructor(private dbConfig: mysql.PoolOptions) {
    this.pool = mysql.createPool(this.dbConfig);
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      console.log('Conexion a Mysql exitosa!');
      return await this.pool.getConnection();
    } catch (error) {
      throw new Error('Error al establecer la conexion: ' + error);
    } 
  }

}