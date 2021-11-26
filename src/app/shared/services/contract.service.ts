import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Status} from "../models/status";
import {Contract} from "../models/contract";
import {FilterList} from "../models/filterList";
import {ContractStateReplyDTO} from "../dtos/contract.state.reply.dto";
import {SocketManagementApp} from "../modules/shared.module";


@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient,
              private socket: SocketManagementApp) { }

  createContract(contract: Contract): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/create', contract);
  }

  requestContract(contract: Contract): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/requestContract', contract)
  }

  getContracts(filter: string): Observable<FilterList<Contract>>{
    return this.http.get<FilterList<Contract>>(environment.apiUrl + '/contract/getContracts' + filter);
  }

  getContractByID(ID: number): Observable<Contract>{
    return this.http.get<Contract>(environment.apiUrl + `/contract/getContractByID?ID=${ID}`);
  }

  getContractByIDUser(ID: number): Observable<Contract>{
    return this.http.get<Contract>(environment.apiUrl + `/contract/getContractByIDUser?ID=${ID}`);
  }

  getContractsByUserID(ID: number): Observable<Contract[]>{
    return this.http.get<Contract[]>(environment.apiUrl + `/contract/getContractByUserID?ID=${ID}`);
  }

  updateContract(contract: Contract): Observable<Contract>{
    return this.http.put<Contract>(environment.apiUrl + '/contract/update', contract);
  }

  confirmContractState(contractSateReplyDTO: ContractStateReplyDTO): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/contractStateReply', contractSateReplyDTO);
  }

  requestRenewal(contract: Contract): Observable<Contract>{
    return this.http.post<Contract>(environment.apiUrl + '/contract/requestRenewal', contract);
  }


  getContractStatuses(): Observable<Status[]>{
    return this.http.get<Status[]>(environment.apiUrl + '/contract/getContractStatuses');
  }


  listenForCreate(): Observable<Contract>{
    return this.socket.fromEvent<Contract>('contractCreated');
  }

  listenForUpdateChangeAdmin(): Observable<Contract>{
    return this.socket.fromEvent<Contract>('contractUpdatedAdmin');
  }

}
