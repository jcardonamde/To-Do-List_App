import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let taskService: jasmine.SpyObj<TaskService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let alertController: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'addTask', 'deleteTask', 'updateTask', 'clearCompletedTasks']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories', 'addCategory', 'updateCategory', 'deleteCategory']);
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        TranslateService
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Debe añadir una nueva tarea si se proporciona el título de la tarea y se selecciona la categoría', () => {
    taskService.getTasks.and.returnValue([]);
    component.newTask = 'Test Task';
    component.taskCategory = 'category1';
    const initialTaskCount = component.tasks.length;

    component.addTask();

    expect(taskService.addTask).toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialTaskCount + 1);
    expect(component.tasks[component.tasks.length - 1].title).toBe('Test Task');
  });

  it('No debe añadir una tarea si el título está vacío', () => {
    taskService.getTasks.and.returnValue([]);
    component.newTask = '';
    component.taskCategory = 'category1';
    const initialTaskCount = component.tasks.length;

    component.addTask();

    expect(taskService.addTask).not.toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialTaskCount);
  });

  it('No debe añadir una tarea si no se selecciona ninguna categoría', () => {
    taskService.getTasks.and.returnValue([]);
    component.newTask = 'Test Task';
    component.taskCategory = '';
    const initialTaskCount = component.tasks.length;

    component.addTask();

    expect(taskService.addTask).not.toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialTaskCount);
  });

  it('Debe alternar el estado de tarea completada', () => {
    const task = { id: '1', title: 'Test Task', categoryId: 'category1', completed: false };
    taskService.getTasks.and.returnValue([task]);

    component.toggleTask(task);

    expect(task.completed).toBeTrue();
    expect(taskService.updateTask).toHaveBeenCalledWith(task);
  });

  it('Debe eliminar una tarea por su ID', () => {
    const task = { id: '1', title: 'Test Task', categoryId: 'category1', completed: false };
    taskService.getTasks.and.returnValue([task]);

    component.deleteTask('1');

    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks.length).toBe(0);
  });

  it('Debe filtrar las tareas por categoría', () => {
    const task1 = { id: '1', title: 'Task 1', categoryId: 'category1', completed: false };
    const task2 = { id: '2', title: 'Task 2', categoryId: 'category2', completed: false };

    // Simula que el servicio de tareas devuelve una lista de tareas
    taskService.getTasks.and.returnValue([task1, task2]);

    // Llama al método de carga de tareas para establecer el estado inicial
    component['loadTasks']();  // Carga las tareas simuladas desde el servicio

    // Filtra las tareas por categoría
    component.filterTasksByCategory('category1');

    // Verifica que solo una tarea esté en la lista filtrada y que sea la correcta
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Task 1');
  });
});
