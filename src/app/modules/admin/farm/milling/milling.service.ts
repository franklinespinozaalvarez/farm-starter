import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MillingService{

  constructor(
      private _http: HttpClient
  ) { }
  
}
