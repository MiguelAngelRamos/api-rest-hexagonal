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

  it('should create a new student', async () => {

    const token = await getTestToken();

    const newStudent = {
      name: 'James Gosling',
      age: 50
    };

    const response = await request(app)
                    .post('/students')
                    .send(newStudent)
                    .set('Authorization', `Bearer ${token}`);

    console.log(response.status);
    console.log(response.body.name);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newStudent.name);
  });

  it('should get a student by ID', async () => {
    const token = await getTestToken();
    const studentId = 4;
    const response = await request(app)
                      .get(`/students/${studentId}`)
                      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(studentId);

  });

  it('should update a student', async () => {
    const token = await getTestToken();
    const studentId = 4;
    const updateStudent = {
      name: 'Sofia Catalina',
      age: 27
    };
    const response = await request(app)
    .put(`/students/${studentId}`)
    .send(updateStudent)
    .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateStudent.name);
  });
}); 