import { Component } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { AlertController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomeConfig } from './home.config';

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
  selectedCategory: string = '';

  public HomeConfig = HomeConfig;
  public texts: { [key: string]: string } = {};

  constructor(
    private alertController: AlertController,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.loadTexts();
  }

  // Se llama cuando la vista está a punto de entrar en el ciclo de vida activo.
  // Carga las tareas desde el servicio
  ionViewWillEnter() {
    this.loadTasks();
  }

  // Getters Publicos
  public get categories(): Category[] {
    return this.categoryService.getCategories();
  }

  public get tasks(): Task[] {
    return this.taskService.getTasks();
  }

  // Maneja el cambio en la selección de categoría
  // Puede añadir una nueva categoría, gestionar categorías existentes, o filtrar tareas
  public async onCategoryChange(event: any) {
    switch (event.detail.value) {
      case 'addNewCategory':
        await this.addNewCategory();
        break;
      case 'manageCategory':
        await this.manageCategories();
        break;
      default:
        this.filterTasksByCategory(event.detail.value);
    }
  }

  // Añade una nueva tarea a la lista y la asigna a una categoría
  public async addTask() {
    if (this.newTask.trim() === '') return;

    if (!this.taskCategory) {
      const alert = await this.alertController.create({
        header: 'Categoría requerida',
        message: 'Por favor, elija una categoría para la tarea.',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    // Crear la nueva tarea si se tiene una categoria seleccionada
    const task: Task = {
      id: this.generateId(),
      title: this.newTask,
      categoryId: this.taskCategory,
      completed: false,
    };

    this.taskService.addTask(task);
    this.resetTaskInput();
    this.filterTasksByCategory(this.taskCategory);
  }

  // Elimina una tarea por su ID
  public deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
    this.filterTasksByCategory(this.taskCategory);
  }

  // Alterna el estado de completado de una tarea
  public toggleTask(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
    this.updateCompletedTasks();
    this.cdr.detectChanges();
  }

  // Elimina todas las tareas completadas
  public clearCompleted() {
    this.taskService.clearCompletedTasks();
    this.filterTasksByCategory(this.taskCategory);
  }

  // Devuelve el nombre de una categoría dado su ID
  public getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  // Filtra las tareas según la categoría seleccionada
  public filterTasksByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    if (!categoryId) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.categoryId === categoryId);
    }
    this.updateCompletedTasks();
  }

  // Genera un ID único para las nuevas tareas
  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Carga las tareas desde el servicio y actualiza la lista de tareas filtradas
  private loadTasks() {
    this.filteredTasks = [...this.tasks];
    this.updateCompletedTasks();
  }

  // Actualiza el número de tareas completadas
  private updateCompletedTasks() {
    this.completedTasks = this.filteredTasks.filter(t => t.completed).length;
  }

  // Resetea los campos de entrada de nueva tarea y categoría seleccionada
  private resetTaskInput() {
    this.newTask = '';
    this.taskCategory = '';
  }

  // Muestra un alerta para añadir una nueva categoría
  // Después de añadirla, asigna la nueva categoría a la tarea actual
  private async addNewCategory() {
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

  // Muestra un alerta para gestionar (editar o eliminar) categorías existentes
  private async manageCategories() {
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

  // Método general para cargar todos los textos necesarios
  private loadTexts() {
    const keys = Object.values(HomeConfig);
    this.translate.get(keys).subscribe(translations => {
      console.log('Loaded translations:', translations);

      keys.forEach((key) => {
        this.texts[key] = translations[key];
      });
    });
  }
}
