import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IGenericResponse, ILoginRequest, IUsers } from '../models/auth.model';
import { POST_AUTH } from '../../../Utils/Urls';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<IUsers | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            const user = localStorage.getItem('currentUser');
            if (user) {
                this.currentUserSubject.next(JSON.parse(user));
            }
        }
    }

    login(credentials: ILoginRequest): Observable<IGenericResponse<IUsers>> {
        let headers = new HttpHeaders({
            'Content-type': 'application/json'
        })
        return this.http.post<IGenericResponse<IUsers>>(POST_AUTH, JSON.stringify(credentials), { headers }).pipe(
            tap(response => {
                if (response.status === 200) {
                    localStorage.setItem('currentUser', JSON.stringify(response.result));
                    localStorage.setItem('tk', response.result.token);
                    this.currentUserSubject.next(response.result);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getCurrentUser(): IUsers | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        const user = this.getCurrentUser();
        return user ? user.token : null;
    }
}