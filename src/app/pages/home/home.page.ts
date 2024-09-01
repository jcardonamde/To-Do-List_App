import { Component } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { AlertController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  newTask: string = '';
  taskCategory: string = '';
  filteredTasks: Task[] = [];
  completedTasks: number = 0;

  constructor(
    private alertController: AlertController,
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {}

  ionViewWillEnter() {
    this.loadTasks();
  }

  get categories(): Category[] {
    return this.categoryService.getCategories();
  }

  get tasks(): Task[] {
    return this.taskService.getTasks();
  }

  async onCategoryChange(event: any) {
    if (event.detail.value === 'addNewCategory') {
      await this.addNewCategory();
    } else if (event.detail.value === 'manageCategory') {
      await this.manageCategories();
    } else {
      this.filterTasksByCategory(event.detail.value);
    }
  }

  async addNewCategory() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'newCategory',
          type: 'text',
          placeholder: 'Nombre de la nueva categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.newCategory) {
              const newCategory = this.categoryService.addCategory(data.newCategory);
              this.taskCategory = newCategory.id;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async manageCategories() {
    const alert = await this.alertController.create({
      header: 'Gestionar Categorías',
      inputs: this.categories.map(category => ({
        name: category.id,
        type: 'text',
        value: category.name,
        placeholder: `Editar ${category.name}`
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar Cambios',
          handler: (data) => {
            for (let categoryId in data) {
              this.categoryService.updateCategory(categoryId, data[categoryId]);
            }
          }
        },
        {
          text: 'Eliminar Categoría',
          handler: async () => {
            const deleteAlert = await this.alertController.create({
              header: 'Eliminar Categoría',
              inputs: this.categories.map(category => ({
                name: category.id,
                type: 'radio',
                label: category.name,
                value: category.id,
              })),
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Eliminar',
                  handler: (categoryId) => {
                    this.categoryService.deleteCategory(categoryId);
                    if (this.taskCategory === categoryId) {
                      this.taskCategory = '';
                    }
                    this.filterTasksByCategory(this.taskCategory);
                  }
                }
              ]
            });
            await deleteAlert.present();
          }
        }
      ]
    });

    await alert.present();
  }

  addTask() {
    if (this.newTask.trim() === '') return;

    const task: Task = {
      id: this.generateId(),
      title: this.newTask,
      categoryId: this.taskCategory,
      completed: false,
    };

    this.taskService.addTask(task);
    this.newTask = '';
    this.taskCategory = '';
    this.filterTasksByCategory(this.taskCategory);
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
    this.updateCompletedTasks();
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
    this.filterTasksByCategory(this.taskCategory);
  }

  clearCompleted() {
    this.taskService.clearCompletedTasks();
    this.filterTasksByCategory(this.taskCategory);
  }

  updateCompletedTasks() {
    this.completedTasks = this.filteredTasks.filter(t => t.completed).length;
  }

  filterTasksByCategory(categoryId: string) {
    if (!categoryId) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.categoryId === categoryId);
    }
    this.updateCompletedTasks();
  }

  private loadTasks() {
    this.filteredTasks = [...this.tasks];
    this.updateCompletedTasks();
  }

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
