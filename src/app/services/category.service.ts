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

  private loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : [];
  }

  private saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(name: string): Category {
    const newCategory: Category = {
      id: this.generateId(),
      name
    };
    this.categories.push(newCategory);
    this.saveCategories();
    return newCategory;
  }

  updateCategory(id: string, name: string) {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index > -1) {
      this.categories[index].name = name;
      this.saveCategories();
    }
  }

  deleteCategory(id: string) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    this.saveCategories();
  }

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
