import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {FilterList} from "../models/filterList";
import {Resume} from "../models/resume";
import {ResumeDTO} from "../dtos/resumeDTO";
import {User} from "../models/user";
import {ResumeAmountRequestDTO} from "../dtos/resume.amount.request.dto";
import {GetResumesDTO} from "../dtos/get.resumes.dto";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) { }

  getResumeByID(resumeID: number): Observable<Resume>{
    return this.http.get<Resume>(environment.apiUrl + `/resume/getResumeByID?ID=${resumeID}`);
  }

  getResumeByIDUser(resumeID: number): Observable<Resume>{
    return this.http.get<Resume>(environment.apiUrl + `/resume/getResumeByIDUser?ID=${resumeID}`);
  }

  getResumes(getResumesDTO: GetResumesDTO): Observable<FilterList<Resume>>{
    return this.http.post<FilterList<Resume>>(environment.apiUrl + '/resume/getResumes', getResumesDTO)
  }

}
