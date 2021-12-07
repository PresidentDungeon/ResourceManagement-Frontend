import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackMessage } from "../shared/helpers/snack-message";
import { Resume } from "../shared/models/resume";
import { ResumeService } from "../shared/services/resume.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ResumeRequest } from "../shared/models/resume-request";
import { AuthenticationService } from "../shared/services/authentication.service";
import { GetResumesDTO } from "../shared/dtos/get.resumes.dto";
import { AbstractControl } from "@angular/forms";
import { Contract } from "../shared/models/contract";
import { ContractService } from "../shared/services/contract.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})

export class ResumeListComponent implements OnInit {

  constructor(
    private snackbar: SnackMessage,
    private resumeService: ResumeService,
    private contractService: ContractService,
    private authService: AuthenticationService,
    private dialog: MatDialog) { }

  @Input() isAdminPage: boolean = true;
  @Input() displayLoad: boolean;
  @Input() displayPagination: boolean;
  @Input() displaySelect: boolean;
  @Input() displayInserted: boolean;
  @Input() displayResumeCountInfo: boolean;
  @Input() displayAll: boolean;
  @Input() dataSource: Resume[] = [];
  @Input() resumesObservable: Observable<Resume[]>;
  @Input() excludeContractID: number = 0;
  @Input() isOverview: boolean = false;

  @Input() startDateControl: AbstractControl
  @Input() endDateControl: AbstractControl

  @Output() selectedResumesEmitter = new EventEmitter();

  displayedColumnsWithCandidates: string[] = ['occupation', 'candidates', 'iconStatus', 'select'];
  displayedColumnsWithoutCandidates: string[] = ['occupation', 'select'];
  displayedColumnsWithoutSelect: string[] = ['occupation', 'candidates', 'iconStatus'];

  displayedColumns: string[];
  selectedResume?: Resume;

  selectedResumeBooking: Resume;
  selectedResumeContracts: Contract[] = [];

  startDate: Date = null;
  endDate: Date = null;

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

  totalOccupation: ResumeRequest = { ID: 0, occupation: 'Total', count: 0 };
  occupationTypes: ResumeRequest[] = [];

  ngOnInit(): void {
    if(this.isAdminPage){this.authService.verifyAdmin().subscribe();}
    if(this.isOverview){this.displayedColumns = this.displayedColumnsWithoutSelect}
    else{this.displayedColumns = (this.isAdminPage) ? this.displayedColumnsWithCandidates : this.displayedColumnsWithoutCandidates;}

    this.nameSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
      subscribe((search) => { this.nameSearchTerm = search; this.getResumes() });

    this.occupationSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
      subscribe((search) => {
        this.occupationSearchTerm = search;
        if(this.isAdminPage){this.getResumes()}
        else{this.searchFilter();}});

    if(this.isAdminPage && this.resumesObservable != undefined){
      this.resumesObservable.subscribe((selectedResumes) => {
        this.getResumes();
        this.insertSelected(selectedResumes);
      });
    }

    else if(this.isAdminPage){
      this.getResumes();
    }

    else if(!this.isAdminPage){
      this.resumesObservable.subscribe((resumes) => {
        this.initialContractResumes = resumes;
        this.dataSource = resumes;

        if(!this.displaySelect && this.displayInserted){this.insertSelected(resumes);}
      });
    }

    if(this.startDateControl != null && this.endDateControl != null){
      this.setDates();
      this.startDateControl.valueChanges.subscribe((value) => {this.setDates();});
      this.endDateControl.valueChanges.subscribe((value) => {this.setDates();});
    }
  }

  setDates(){
    this.startDate = this.startDateControl.value;
    this.endDate = this.endDateControl.value;
    this.getResumes();
  }

  getResumes() {
    if (this.displayLoad) { this.snackbarRef = this.snackbar.open('') };

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.nameSearchTerm}`
      + `&occupation=${this.occupationSearchTerm}&sorting=ASC&sortingType=ADDED`;

    const getResumeDTO: GetResumesDTO = {searchFilter: filter, shouldLoadResumeCount: this.displayResumeCountInfo, excludeContract: this.excludeContractID, startDate: this.startDate, endDate: this.endDate};
    this.resumeService.getResumes(getResumeDTO).subscribe((filterList) => {
      this.pageLength = filterList.totalItems;
      this.dataSource = filterList.list;},
      (error) => {this.snackbar.open('error', error.error.message);},
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
    else { this.occupationTypes.push({ID: 0, occupation: occupationString, count: 1 }); }
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

  displayResumeBooking(resume: Resume, template: TemplateRef<any>) {

      this.contractService.getContractsByResumeID(resume.ID).subscribe((contracts) => {

        this.selectedResumeBooking = resume;
        this.selectedResumeContracts = contracts;
        this.dialog.open(template, {width: '400px', autoFocus: false});

        },
        (error) => {this.snackbar.open('error', error.error.message)});

  }
}
