import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { IProduct } from '../models/product.model';
import { ICategory } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  exportProductsToExcel(products: IProduct[], fileName: string = 'productos'): void {
    const dataToExport = products.map(product => ({
      'ID': product.id,
      'Nombre': product.name,
      'Descripción': product.shortDescription,
      'Categoría': product.category.name,
      'Autor': product.author.name,
      'Email del Autor': product.author.email,
      'Fecha de Creación': new Date(product.createdAt).toLocaleDateString('es-ES'),
      'Estado': product.status ? 'Activo' : 'Inactivo',
      'URL de Imagen': product.imageUrl
    }));

    this.exportToExcel(dataToExport, fileName);
  }

  exportCategoriesToExcel(categories: ICategory[], fileName: string = 'categorias'): void {
    const dataToExport = categories.map(category => ({
      'ID': category.id,
      'Nombre': category.name,
      'Descripción': category.description,
      'Estado': category.isActive ? 'Activo' : 'Inactivo'
    }));

    this.exportToExcel(dataToExport, fileName);
  }

  private exportToExcel(data: any[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    
    const columnWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = columnWidths;
    
    const fullFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);
  }
}