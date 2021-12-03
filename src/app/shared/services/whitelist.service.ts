import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { FilterList } from "../models/filterList";
import {Whitelist} from "../models/whitelist";

@Injectable({
  providedIn: 'root'
})

export class WhitelistService {

  constructor(private http: HttpClient) { }

  createWhitelist(whitelist: Whitelist): Observable<Whitelist>{
    return this.http.post<Whitelist>(environment.apiUrl + '/whitelist/createWhitelist', whitelist);
  }

  getWhitelists(filter: string): Observable<FilterList<Whitelist>>{
    return this.http.get<FilterList<Whitelist>>(environment.apiUrl + '/whitelist/getWhitelists' + filter);
  }

  updateWhitelist(whitelist: Whitelist): Observable<Whitelist>{
    return this.http.put<Whitelist>(environment.apiUrl + '/whitelist/updateWhitelist', whitelist);
  }

  deleteWhitelist(whitelist: Whitelist): Observable<void>{
    return this.http.post<void>(environment.apiUrl + '/whitelist/deleteWhitelist', whitelist);
  }
}
