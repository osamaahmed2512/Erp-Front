import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDto, RefreshTokenRequestDto, RegisterUserDto } from '../../features/auth/models/auth';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../shared/Models/paginated-response';
import { LoginResponseDto } from '../../features/auth/models/login-response-dto';
import { BaseApiResponse } from '../../shared/Models/base-api-response';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) {
    
  }

  logIn(data:LoginRequestDto):Observable<BaseApiResponse<LoginResponseDto>>{
     return this.http.post<BaseApiResponse<LoginResponseDto>>(`${this.baseUrl}/Auth/login`,data);
  }
  Register(data:RegisterUserDto):Observable<any>{
    return this.http.post(`${this.baseUrl}/Auth/register`,data);
  }
  refreshToken(data: RefreshTokenRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/Auth/refresh-token`, data);
  }
}
