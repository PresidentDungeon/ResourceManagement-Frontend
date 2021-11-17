import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Status} from "../models/status";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient) { }

  getContractStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/contract/getContractStatuses');
  }
}
