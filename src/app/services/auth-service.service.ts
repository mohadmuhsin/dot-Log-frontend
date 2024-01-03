import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {EnviromentTs} from '../enviroment.ts'

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  apiUrl = EnviromentTs.apiUrl;

  constructor(private http:HttpClient) { }

  login(data:any, google:boolean){
    const params = new HttpParams()
      .set('google', google);
    return this.http.post(`${this.apiUrl}/login`,data,{ params, withCredentials:true });
  }
  register(data:any, google:boolean){
    const params = new HttpParams()
      .set('google', google);
    return this.http.post(`${this.apiUrl}/register`,data,{ params, withCredentials:true})
  }
}
