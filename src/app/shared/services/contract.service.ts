import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Status} from "../models/status";
import {Contract} from "../models/contract";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient) { }

  createContract(contract: Contract): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/create', contract);
  }

  getContractByID(ID: number): Observable<Contract>{
    return this.http.get<Contract>(environment.apiUrl + `/contract/getContractByID?ID=${ID}`);
  }

  updateContract(contract: Contract): Observable<Contract>{
    return this.http.put<Contract>(environment.apiUrl + '/contract/update', contract);
  }


  getContractStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/contract/getContractStatuses');
  }
}
