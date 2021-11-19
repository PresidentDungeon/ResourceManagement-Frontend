import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Status} from "../models/status";
import {Contract} from "../models/contract";
import {concatAll} from "rxjs/operators";
import {Resume} from "../models/resume";
import {FilterList} from "../models/filterList";
import {ContractStateReplyDTO} from "../dtos/contract.state.reply.dto";


@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient) { }

  createContract(contract: Contract): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/create', contract);
  }

  getContracts(filter: string): Observable<FilterList<Contract>>{
    return this.http.get<FilterList<Contract>>(environment.apiUrl + '/contract/getContracts' + filter);
  }

  getContractByID(ID: number): Observable<Contract>{
    return this.http.get<Contract>(environment.apiUrl + `/contract/getContractByID?ID=${ID}`);
  }

  getContractByUserID(ID: number): Observable<Contract[]>{
    return this.http.get<Contract[]>(environment.apiUrl + `/contract/getContractByUserID?ID=${ID}`);
  }

  updateContract(contract: Contract): Observable<Contract>{
    return this.http.put<Contract>(environment.apiUrl + '/contract/update', contract);
  }

  confirmContractState(contractSateReplyDTO: ContractStateReplyDTO): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/contractStateReply', contractSateReplyDTO);
  }


  getContractStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/contract/getContractStatuses');
  }
}
