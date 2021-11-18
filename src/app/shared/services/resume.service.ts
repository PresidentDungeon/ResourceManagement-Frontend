import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {FilterList} from "../models/filterList";
import {Resume} from "../models/resume";
import {ResumeDTO} from "../dtos/resumeDTO";
import {User} from "../models/user";
import {ResumeAmountRequestDTO} from "../dtos/resume.amount.request.dto";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient) { }

  getResumeByID(resumeID: number): Observable<Resume>{
    return this.http.get<Resume>(environment.mockAPIUrl + `/resume/getResumeByID?ID=${resumeID}`);
  }

  async getResumesByID(IDs: number[]): Promise<Resume[]>{

    let resumes: Resume[] = []
    const promises: Promise<Resume>[] = []

    IDs.forEach((resumeID) => {
      const promise: Promise<Resume> = this.getResumeByID(resumeID).toPromise();
      promise.then((resume) => {resumes.push(resume)});
      promises.push(promise);
    });

    await Promise.all(promises);
    return resumes;

  }

  getResumes(filter: string): Observable<FilterList<Resume>>{
    return this.http.get<FilterList<Resume>>(environment.mockAPIUrl + '/resume/getResumes' + filter);
  }

  getResumesCount(requestDTO: ResumeAmountRequestDTO): Observable<ResumeDTO[]>{
    return this.http.post<ResumeDTO[]>(environment.apiUrl + '/contract/getResumesAmount', requestDTO);
  }
}
