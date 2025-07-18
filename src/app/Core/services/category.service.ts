import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortBy, SortOrder } from '../enums/sort.enum';
import { IGenericResponse } from '../models/auth.model';
import { IPagedResult } from '../models/product.model';
import { CATEGORY, PRODUCTS } from '../../../Utils/Urls';
import { ICategory } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) { }

    getCategories(
        name?: string,
        sortBy: SortBy = SortBy.Name,
        sortOrder: SortOrder = SortOrder.Ascending,
        page: number = 1,
        pageSize: number = 10
    ): Observable<IGenericResponse<IPagedResult<ICategory>>> {
        let queryParams: any = {
            sortBy: sortBy,
            sortOrder: sortOrder,
            page: page.toString(),
            pageSize: pageSize.toString()
        };
        if (name) queryParams.name = name;
        return this.http.get<IGenericResponse<IPagedResult<ICategory>>>(CATEGORY, { params: queryParams });
    }

    getCategoryById(id: string): Observable<IGenericResponse<ICategory>> {
        return this.http.get<IGenericResponse<ICategory>>(`${CATEGORY}/${id}`);
    }

    createCategory(categoryData: ICategory): Observable<IGenericResponse<number>> {
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
        })
        return this.http.post<any>(CATEGORY, JSON.stringify(categoryData), { headers });
    }

    updateCategory(id: string, categoryData: any): Observable<IGenericResponse<number>> {
        let headers = new HttpHeaders({
            'Content-type': 'application/json',
        })
        return this.http.patch<IGenericResponse<number>>(`${CATEGORY}/${id}`, JSON.stringify(categoryData), { headers });
    }
}