import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

import { TodoListComponent } from './todo-list.component';
import { TaskService, Task } from '../../services/task.service';

// Mock TaskService
class MockTaskService {
  tasks: Task[] = [
    { id: 1, title: 'Tarea Mock 1', completed: false },
    { id: 2, title: 'Tarea Mock 2', completed: true },
  ];

  getTasks() {
    return of([...this.tasks]);
  }

  addTask(title: string) {
    const newTask: Task = { id: Date.now(), title, completed: false };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: number, completed: boolean) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = completed;
      return of({ ...task });
    }
    return throwError(() => new Error('Tarea no encontrada en mock'));
  }
}

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let taskService: MockTaskService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule, // Aunque usemos mock, el servicio real lo importa
        TodoListComponent // Importar el componente standalone
      ],
      providers: [
        { provide: TaskService, useClass: MockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as unknown as MockTaskService; // Obtener la instancia del mock
    compiled = fixture.nativeElement;
    fixture.detectChanges(); // ngOnInit() se llama aquí
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las tareas al inicializar', () => {
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].title).toBe('Tarea Mock 1');
    const taskElements = compiled.querySelectorAll('.task-list li');
    expect(taskElements.length).toBe(2);
    expect(taskElements[0].textContent).toContain('Tarea Mock 1');
  });

  it('debería añadir una nueva tarea', fakeAsync(() => {
    component.newTaskTitle = 'Nueva Tarea Test';
    const addButton = compiled.querySelector('.add-task-form button') as HTMLButtonElement;
    addButton.click();
    tick(); // Simular el paso del tiempo para que se resuelva el Observable
    fixture.detectChanges(); // Actualizar la vista

    expect(component.tasks.length).toBe(3);
    expect(component.tasks[2].title).toBe('Nueva Tarea Test');
    expect(component.newTaskTitle).toBe(''); // El campo de texto debería limpiarse
    const taskElements = compiled.querySelectorAll('.task-list li');
    expect(taskElements.length).toBe(3);
    expect(taskElements[2].textContent).toContain('Nueva Tarea Test');
  }));

  it('no debería añadir una tarea si el título está vacío', () => {
    const initialTaskCount = component.tasks.length;
    component.newTaskTitle = '   '; // Título vacío o solo espacios
    const addButton = compiled.querySelector('.add-task-form button') as HTMLButtonElement;
    addButton.click();
    fixture.detectChanges();

    expect(component.tasks.length).toBe(initialTaskCount);
  });

  it('debería cambiar el estado de completado de una tarea al hacer clic en el título', fakeAsync(() => {
    const firstTaskElement = compiled.querySelector('.task-list li .task-title') as HTMLElement;
    const initialCompletedStatus = component.tasks[0].completed;

    firstTaskElement.click();
    tick();
    fixture.detectChanges();

    expect(component.tasks[0].completed).toBe(!initialCompletedStatus);
    const firstTaskLi = compiled.querySelector('.task-list li');
    if (!initialCompletedStatus) {
      expect(firstTaskLi?.classList).toContain('completed');
    } else {
      expect(firstTaskLi?.classList).not.toContain('completed');
    }
  }));

  it('debería cambiar el estado de completado de una tarea al cambiar el checkbox', fakeAsync(() => {
    const firstTaskCheckbox = compiled.querySelector('.task-list li input[type="checkbox"] ') as HTMLInputElement;
    const initialCompletedStatus = component.tasks[0].completed;

    firstTaskCheckbox.click(); // Simula el clic que cambia el estado del checkbox
    tick();
    fixture.detectChanges();

    expect(component.tasks[0].completed).toBe(!initialCompletedStatus);
  }));

  it('debería mostrar un mensaje si no hay tareas', () => {
    component.tasks = [];
    fixture.detectChanges();
    const emptyMessage = compiled.querySelector('.empty-message');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage?.textContent).toContain('No hay tareas pendientes.');
  });

});
