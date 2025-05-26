import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService, Task } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('debería devolver un Observable<Task[]>', () => {
      const dummyTasks: Task[] = [
        { id: 1, title: 'Test Task 1', completed: false },
        { id: 2, title: 'Test Task 2', completed: true }
      ];

      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBe(2);
        expect(tasks).toEqual(dummyTasks);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyTasks);
    });
  });

  describe('addTask', () => {
    it('debería enviar una nueva tarea y devolver un Observable<Task>', () => {
      const newTaskTitle = 'New Test Task';
      const dummyTask: Task = { id: 3, title: newTaskTitle, completed: false };

      service.addTask(newTaskTitle).subscribe(task => {
        expect(task).toEqual(dummyTask);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ title: newTaskTitle });
      req.flush(dummyTask);
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea existente y devolver un Observable<Task>', () => {
      const taskId = 1;
      const completedStatus = true;
      const updatedTask: Task = { id: taskId, title: 'Updated Task', completed: completedStatus };

      service.updateTask(taskId, completedStatus).subscribe(task => {
        expect(task).toEqual(updatedTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ completed: completedStatus });
      req.flush(updatedTask);
    });
  });
});
