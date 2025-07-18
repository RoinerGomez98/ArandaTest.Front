import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortBy, SortOrder } from '../enums/sort.enum';
import { IGenericResponse } from '../models/auth.model';
import { IPagedResult, IProduct } from '../models/product.model';
import { PRODUCTS } from '../../../Utils/Urls';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }

    getProducts(
        name?: string,
        description?: string,
        category?: string,
        sortBy: SortBy = SortBy.Name,
        sortOrder: SortOrder = SortOrder.Ascending,
        page: number = 1,
        pageSize: number = 10
    ): Observable<IGenericResponse<IPagedResult<IProduct>>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (name) params = params.set('name', name);
        if (description) params = params.set('description', description);
        if (category) params = params.set('category', category);
        params = params.set('sortBy', sortBy.toString());
        params = params.set('sortOrder', sortOrder.toString());
        
        return this.http.get<IGenericResponse<IPagedResult<IProduct>>>(PRODUCTS, { params });
    }

    getProductById(id: string): Observable<IGenericResponse<IProduct>> {
        return this.http.get<IGenericResponse<IProduct>>(`${PRODUCTS}/${id}`);
    }

    createProduct(productData: FormData): Observable<IGenericResponse<number>> {
        return this.http.post<any>(PRODUCTS, productData);
    }

    updateProduct(id: string, productData: FormData): Observable<IGenericResponse<number>> {
        return this.http.patch<IGenericResponse<number>>(`${PRODUCTS}/${id}`, productData);
    }

    deleteProduct(id: string): Observable<IGenericResponse<boolean>> {
        return this.http.delete<IGenericResponse<boolean>>(`${PRODUCTS}/${id}`);
    }
}