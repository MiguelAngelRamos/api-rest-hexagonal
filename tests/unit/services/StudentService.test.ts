import { StudentService } from '../../../src/application/service/StudentService';


const mockStudentRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
  /* jest.fn() es una función de jest que crea un función simulada, conocida como mock, permite rastrear las llamadas a la funcion, simular entornos especificos, adicional nos permite cambiar la implementación en tiempo de ejecución  */
}

//* Crear un instancia del servicio de estudiantes usando un repositorio simulado
const studentService = new StudentService(mockStudentRepository);

//* "COMIENZA" un "Bloque de prueba" para el servicio de estudiantes

describe('StudentService', () => {
  //* Antes de cada prueba del bloque "StudentService", limpia todos los mocks para asegurar que no haya
  //* interferencias entre pruebas.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStudents', () => {
    it('should return all students', async () => {
      //* Simula que el método findAll del repositorio devuelve una lista de estudiantes
      mockStudentRepository.findAll.mockResolvedValue([{ id: 1, name: 'Richard', age: 25}, {id: 2, name: 'James', age: 30}]);

      //* Llama al método getAllStudents y almacena el resultado 
      const result = await studentService.getAllStudents();

      //* Asegura que el resultado tenga dos estudiantes
      expect(result).toHaveLength(2);
      //* Aseguro que el primer estudiante tenga el nombre 'Richard'
      expect(result[0].name).toBe('Richard');
      //* Aseguro que el segundo estudiante tenga el nombre 'James'
      expect(result[1].name).toBe('James');
    });
  });

  describe('getStudentById', () => {
    it('should return the correct student base on ID', async () => {
      //* Simula que el método findById del repositorio devuelve un estudiante especifico
      mockStudentRepository.findById.mockResolvedValue({id: 1, name: 'Linus', age: 25});

      //* llama al metodo getStudentById con el id 1 y almacena el resultado
      const result = await studentService.getStudentById(1);

      //* Asegura que el estudiante devuelto tenga el nombre 'Linus' 
      if(result) {
        expect(result.name).toBe('Linus');
      }
    });
  });

  describe('createStudent', () => {
    it('should create a student correctly and return the created student', async() =>{

      //* Definir a un nuevo estudiante a crear
      const newStudent = { name:'Catalina', age: 25};

      //* Simulando que el metodo create del repositorio devuelve al estudiante creado con ID
      mockStudentRepository.create.mockResolvedValue({id: 1, name: 'Catalina', age: 25});

      //* llamar al método createStudent con el estudiante a crear y almacena el resultado
      const result = await studentService.createStudent(newStudent);

      if(result) {
        expect(result.id).toBe(1);
        expect(result.name).toBe('Catalina');
      }
    });
  });

  describe('updateStudent' , () => {
    it('should update a student correctly and return the updated student', async () => {
      //* Definir los nuevos valores para actualizar a un estudiante existente
      const updatedStudent = { name: 'Fernanda', age: 24 };

      //* Simula que el método update del repositorio devuelve el estudiante actualizado
      mockStudentRepository.update.mockResolvedValue({ id: 1, name: 'Fernanda', age: 24 });

      const result = await studentService.updateStudent(1, updatedStudent);

      if(result) {
        expect(result.id).toBe(1);
        expect(result.name).toBe('Fernanda');
      }
    });
  })

  describe('deleteStudent', () => {
    it('should delete a student correctly', async() => {
      mockStudentRepository.delete.mockResolvedValue(true);
      await studentService.deleteStudent(1);
      expect(mockStudentRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});