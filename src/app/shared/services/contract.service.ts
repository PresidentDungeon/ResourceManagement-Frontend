import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Status} from "../models/status";
import {Contract} from "../models/contract";
import { FilterList } from '../models/filterList';

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

  getContractByUserID(ID: number): Observable<Contract[]>{
    return this.http.get<Contract[]>(environment.apiUrl + `/contract/getContractByUserID?ID=${ID}`);
  }

  getContracts(filter: string): Observable<FilterList<Contract>>{
    return this.http.get<FilterList<Contract>>(environment.apiUrl + '/contract/getContracts' + filter);
  }

  updateContract(contract: Contract): Observable<Contract>{
    return this.http.put<Contract>(environment.apiUrl + '/contract/update', contract);
  }


  getContractStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/contract/getContractStatuses');
  }
}
