import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { DropDownDto } from '../../shared/Models/drop-down-dto';

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }

  getDropDown(): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(
      `${this.baseUrl}/Nationality/dropdown`
    );
  }
}
