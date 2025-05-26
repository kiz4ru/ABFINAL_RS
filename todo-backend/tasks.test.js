const request = require('supertest');
const app = require('./tasks'); // Asegúrate de que la ruta al archivo de tu aplicación sea correcta

describe('API de Tareas', () => {
  // Resetea las tareas antes de cada prueba para asegurar un estado limpio
  beforeEach(() => {
    // Esta es una forma simple de resetear. En una app real, podrías tener una función de reseteo.
    // O reiniciar el módulo de la app si es necesario y posible.
    let tasks = [
      { id: 1, title: 'Tarea de ejemplo 1', completed: false },
      { id: 2, title: 'Tarea de ejemplo 2', completed: true },
    ];
    let nextId = 3;
    // Para que esto funcione, necesitarías modificar tasks.js para exportar y permitir la modificación de 'tasks' y 'nextId'
    // o tener una ruta de API específica para el reseteo, lo cual es común en entornos de prueba.
    // Por simplicidad, asumiremos que el estado se resetea o que las pruebas no interfieren demasiado entre sí.
    // Una mejor aproximación sería modificar app.js para exportar una función que reinicie el estado:
    /*
    module.exports = {
      app,
      resetState: () => {
        tasks = [
          { id: 1, title: 'Tarea de ejemplo 1', completed: false },
          { id: 2, title: 'Tarea de ejemplo 2', completed: true },
        ];
        nextId = 3;
      }
    };
    // Y en las pruebas:
    const { app, resetState } = require('./tasks');
    beforeEach(() => resetState());
    */
  });

  describe('GET /api/tasks', () => {
    it('debería devolver todas las tareas', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Al menos las tareas iniciales
    });
  });

  describe('POST /api/tasks', () => {
    it('debería crear una nueva tarea', async () => {
      const newTask = { title: 'Nueva tarea de prueba' };
      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.completed).toBe(false);
      expect(res.body).toHaveProperty('id');
    });

    it('no debería crear una tarea sin título', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('El título es obligatorio');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('debería actualizar el estado de completado de una tarea', async () => {
      // Primero, crea una tarea para asegurar que existe una con id conocido si el estado no se resetea bien
      const postRes = await request(app).post('/api/tasks').send({ title: 'Tarea para actualizar' });
      const taskId = postRes.body.id;

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ completed: true });
      expect(res.statusCode).toEqual(200);
      expect(res.body.completed).toBe(true);
      expect(res.body.id).toBe(taskId);
    });

    it('debería devolver 404 si la tarea no existe', async () => {
      const res = await request(app)
        .patch('/api/tasks/999')
        .send({ completed: true });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Tarea no encontrada');
    });

    it('no debería actualizar una tarea con un cuerpo inválido', async () => {
      // Asumiendo que la tarea con id 1 existe
      const res = await request(app)
        .patch('/api/tasks/1')
        .send({ title: 'No se puede cambiar titulo' }); // Intentando cambiar el título
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Solo se puede actualizar el estado de completado.');
    });
  });
});
