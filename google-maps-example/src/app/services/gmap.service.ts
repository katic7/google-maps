import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GmapService {

  constructor(private http:HttpClient) { }

  createField(field):Observable<any>{
    return this.http.post("http://localhost:8080/field/create", field);
  }
}
