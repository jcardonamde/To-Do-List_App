import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];

  constructor() {
    this.loadCategories();
  }

  // Obtiene todas las categorías almacenadas
  public getCategories(): Category[] {
    return this.categories;
  }

  // Añade una nueva categoría
  public addCategory(name: string): Category {
    const newCategory: Category = {
      id: this.generateId(),
      name
    };
    this.categories.push(newCategory);
    this.saveCategories();
    return newCategory;
  }

  // Actualiza el nombre de una categoría existente
  public updateCategory(id: string, name: string) {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index > -1) {
      this.categories[index].name = name;
      this.saveCategories();
    }
  }

  // Elimina una categoría por su ID
  public deleteCategory(id: string) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    this.saveCategories();
  }

  // Carga las categorías desde el almacenamiento local
  private loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : [];
  }

  // Guarda las categorías en el almacenamiento local
  private saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  // Genera un ID único para una nueva categoría
  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
