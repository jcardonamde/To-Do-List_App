import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  // Obtiene todas las tareas almacenadas
  public getTasks(): Task[] {
    return this.tasks;
  }

  // Añade una nueva tarea
  public addTask(task: Task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  // Actualiza una tarea existente
  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index > -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }

  // Elimina una tarea por su ID
  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  // Elimina todas las tareas que han sido completadas
  clearCompletedTasks() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
  }

  // Carga las tareas desde el almacenamiento local
  private loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  // Guarda las tareas en el almacenamiento local
  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
