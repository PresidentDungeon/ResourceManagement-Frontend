import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Resume } from "../shared/models/resume";
import { ResumeService } from "../shared/services/resume.service";
import { ResumeDTO } from "../shared/dtos/resumeDTO";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { OccupationCount } from "../shared/models/occupation-count";
import { AuthenticationService } from "../shared/services/authentication.service";
import {ResumeAmountRequestDTO} from "../shared/dtos/resume.amount.request.dto";
import {GetResumesDTO} from "../shared/dtos/get.resumes.dto";

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})

export class ResumeListComponent implements OnInit {

  constructor(
    private snackbar: SnackMessage,
    private resumeService: ResumeService,
    private authService: AuthenticationService) { }

  @Input() isAdminPage: boolean;
  @Input() displayLoad: boolean;
  @Input() displayPagination: boolean;
  @Input() displaySelect: boolean;
  @Input() displayResumeCountInfo: boolean;
  @Input() displayAll: boolean;
  @Input() dataSource: Resume[] = [];
  @Input() resumesObservable: Observable<Resume[]>;
  @Input() excludeContractID: number = 0;
  @Output() selectedResumesEmitter = new EventEmitter();

  displayedColumnsWithCandidates: string[] = ['occupation', 'candidates', 'iconStatus', 'select'];
  displayedColumnsWithoutCandidates: string[] = ['occupation', 'select'];

  displayedColumns: string[];
  selectedResume?: Resume;

  snackbarRef: MatSnackBarRef<any>;

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  nameSearchTerms = new Subject<string>();
  nameSearchTerm: string = "";
  initialContractResumes: Resume[] = [];

  occupationSearchTerms = new Subject<string>();
  occupationSearchTerm: string = "";

  warningIconCount: number = 2;
  alertIconCount: number = 1;
  availableIconCount: number = 0

  checkedResumes: Resume[] = [];

  totalOccupation: OccupationCount = { occupation: 'Total', count: 0 };
  occupationTypes: OccupationCount[] = [];

  ngOnInit(): void {
    if(this.isAdminPage){this.authService.verifyAdmin().subscribe();}
    this.displayedColumns = (this.isAdminPage) ? this.displayedColumnsWithCandidates : this.displayedColumnsWithoutCandidates;

    this.nameSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
      subscribe((search) => { this.nameSearchTerm = search; this.getResumes() });

    this.occupationSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
      subscribe((search) => {
        this.occupationSearchTerm = search;
        if(this.isAdminPage){this.getResumes()}
        else{this.searchFilter();}});

    if(this.isAdminPage){
      this.resumesObservable.subscribe((selectedResumes) => {
        this.getResumes();
        this.insertSelected(selectedResumes);
      });
    }
    else{
      this.resumesObservable.subscribe((resumes) => {
        this.initialContractResumes = resumes;
        this.dataSource = resumes;

        if(!this.displaySelect){this.insertSelected(resumes);}
      });
    }
  }

  getResumes() {
    if (this.displayLoad) { this.snackbarRef = this.snackbar.open('') };

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.nameSearchTerm}`
      + `&occupation=${this.occupationSearchTerm}&sorting=ASC&sortingType=ADDED`;

    const getResumeDTO: GetResumesDTO = {searchFilter: filter, shouldLoadResumeCount: this.displayResumeCountInfo, excludeContract: this.excludeContractID};
    this.resumeService.getResumes(getResumeDTO).subscribe((filterList) => {
      this.pageLength = filterList.totalItems;
      this.dataSource = filterList.list;},
      (error) => { console.log(error);this.snackbar.open('error', error.error.message);},
      () => { if (this.displayLoad) { this.snackbarRef.dismiss(); } });
  }

  onSelect(resume: Resume): void {

    let resumeObservable: Observable<Resume> = (this.isAdminPage) ? this.resumeService.getResumeByID(resume.ID) : this.resumeService.getResumeByIDUser(resume.ID);

    resumeObservable.subscribe((resume) => {this.selectedResume = resume;},
      (error) => { this.snackbar.open('error', error.error.message) });
  }

  onPaginationChange($event) {
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getResumes();
  }

  checkChange(resume: Resume, $event: any) {
    const checked: boolean = $event.checked;

    if (checked) {
      this.checkedResumes.push(resume);
      this.addOccupation(resume.occupation);
    }
    else {
      const index: number = this.checkedResumes.findIndex(indexResume => indexResume.ID == resume.ID);
      this.checkedResumes.splice(index, 1);
      this.removeOccupation(resume.occupation);
    }

    this.selectedResumesEmitter.emit(this.checkedResumes);
  }

  removeResume(resume: Resume): void {
    const index = this.checkedResumes.indexOf(resume);
    if (index >= 0) {
      this.checkedResumes.splice(index, 1);
    }

    this.removeOccupation(resume.occupation);
    this.selectedResumesEmitter.emit(this.checkedResumes);
  }

  isChecked(resume: Resume) {
    if (this.checkedResumes.find(indexResume => indexResume.ID == resume.ID)) {
      return true;
    }
    return false;
  }

  searchName(term: string): void {
    this.nameSearchTerms.next(term);
  }

  searchOccupation(term: string): void {
    this.occupationSearchTerms.next(term);
  }

  searchFilter(){
      this.dataSource = this.initialContractResumes.filter((resume) => {return resume.occupation.toLowerCase().includes(this.occupationSearchTerm)})
  }

  addOccupation(occupationString: string) {
    const index = this.occupationTypes.findIndex(occupation => occupation.occupation === occupationString);
    if (index != -1) { this.occupationTypes[index].count++; }
    else { this.occupationTypes.push({ occupation: occupationString, count: 1 }); }
    this.totalOccupation.count = this.checkedResumes.length;
  }

  removeOccupation(occupationString: string) {
    const index = this.occupationTypes.findIndex(occupation => occupation.occupation === occupationString);
    if (this.occupationTypes[index].count > 1) { this.occupationTypes[index].count--; }
    else { this.occupationTypes.splice(index, 1); }
    this.totalOccupation.count = this.checkedResumes.length;
  }

  removeOccupations(occupationString: string) {
    this.checkedResumes = this.checkedResumes.filter((resume) => { return resume.occupation !== occupationString });
    this.occupationTypes = this.occupationTypes.filter((occupation) => { return occupation.occupation !== occupationString });
    this.totalOccupation.count = this.checkedResumes.length;
  }

  removeAllOccupations() {
    this.checkedResumes = [];
    this.occupationTypes = [];
    this.totalOccupation.count = this.checkedResumes.length;
  }

  insertSelected(resumes: Resume[]) {
    resumes.forEach((resume) => { this.addOccupation(resume.occupation) });
    this.checkedResumes = resumes;
    this.totalOccupation.count = resumes.length;
  }

}
