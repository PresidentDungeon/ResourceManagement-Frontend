import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {FilterList} from "../models/filterList";
import {Resume} from "../models/resume";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) { }

  getResumeByID(resumeID: number): Observable<Resume>{
    return this.http.get<Resume>(environment.mockAPIUrl + `/resume/getResumeByID?ID=${resumeID}`);
  }

  getResumes(filter: string): Observable<FilterList<Resume>>{
    return this.http.get<FilterList<Resume>>(environment.mockAPIUrl + '/resume/getResumes' + filter);
  }
}
