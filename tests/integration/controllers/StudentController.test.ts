import request from 'supertest';
import { app, server } from '../../../src/server';

//* Función para obtener un token realizando un login.

async function getTestToken() {
  const loginResponse = await request(app)
  .post('/users/login')
  .send({
    username: 'sofia',
    password: 'secreto'
  });

  return loginResponse.body.token;
}

describe('StudentController Integration Tests', () => {
  //* Prueba para obtner a todos los estudiantes
  it('should get all students', async() => {
    const token = await getTestToken(); //* recibo el token que se genera con el login "getTestToken"
    // console.log(token); bearer 9039401940fehfajfhaj
    const response = await request(app).get('/students').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    console.log(response.body);
    console.log(Array.isArray(response.body));
    expect(Array.isArray(response.body)).toBe(true);
  })
}); 