import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackMessage} from "../shared/helpers/snack-message";
import {Resume} from "../shared/models/resume";
import {ResumeService} from "../shared/services/resume.service";
import {ResumeDTO} from "../shared/dtos/resumeDTO";
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {OccupationCount} from "../shared/models/occupation-count";

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})

export class ResumeListComponent implements OnInit {

  constructor(
    private snackbar: SnackMessage,
    private resumeService: ResumeService) {}

  @Input() isAdminPage: boolean;
  @Input() displayPagination: boolean;
  @Input() displaySelect: boolean;
  @Input() displayResumeCountInfo: boolean;
  @Input() dataSource: Resume[] = [];
  @Output() selectedResumeEmitter = new EventEmitter();

  displayedColumnsWithSelect: string[] = ['occupation', 'candidates', 'iconStatus', 'select'];
  displayedColumnsWithoutSelect: string[] = ['occupation', 'candidates'];

  displayedColumns: string[];
  selectedResume?: Resume;

  snackbarRef: MatSnackBarRef<any>;

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  nameSearchTerms = new Subject<string>();
  nameSearchTerm: string = "";

  occupationSearchTerms = new Subject<string>();
  occupationSearchTerm: string = "";

  warningIconCount: number = 2;
  alertIconCount: number = 1;
  availableIconCount: number = 0

  checkedResumes: Resume[] = [];

  totalOccupation: OccupationCount = {occupation: 'Total', count: 0};
  occupationTypes: OccupationCount[] = [];

  ngOnInit(): void {
    this.displayedColumns = (this.displaySelect) ? this.displayedColumnsWithSelect : this.displayedColumnsWithoutSelect;

    this.nameSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.nameSearchTerm = search; this.getResumes()});

    this.occupationSearchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.occupationSearchTerm = search; this.getResumes()});

    if(this.dataSource.length == 0){
      this.getResumes();
    }
  }

  getResumes(){
    this.snackbarRef = this.snackbar.open('');
    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&name=${this.nameSearchTerm}`
      + `&occupation=${this.occupationSearchTerm}&sorting=ASC&sortingType=ADDED`;

    this.resumeService.getResumes(filter).subscribe((filterList) => {

      if(!this.displayResumeCountInfo){
        this.pageLength = filterList.totalItems;
        this.dataSource = filterList.list;
      }
      else{

        let resumeDTOs: ResumeDTO[] = [];
        filterList.list.forEach((resume) => {resumeDTOs.push({ID: resume.ID, count: 0})})

        this.resumeService.getResumesCount(resumeDTOs).subscribe((resumeDTOs) => {

          for(let i = 0; i < filterList.list.length; i++){
            filterList.list[i].count = resumeDTOs[i].count
          }

          this.pageLength = filterList.totalItems;
          this.dataSource = filterList.list;},
          (error) => {this.snackbar.open('error', error.error.message)});
      }},
      (error) => {this.snackbar.open('error', error.error.message)},
      () => {this.snackbarRef.dismiss();});

  }

  onSelect(resume: Resume): void {
    this.resumeService.getResumeByID(resume.ID).subscribe((resume) => {
      this.selectedResume = resume;},
      (error) => {this.snackbar.open('error', error.error.message)});
  }

  onPaginationChange($event){
    this.currentPage = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getResumes();
  }

  checkChange(resume: Resume, $event: any){
    const checked: boolean = $event.checked;

    if(checked){
      this.checkedResumes.push(resume);
      this.addOccupation(resume.occupation);
    }
    else{
      const index: number = this.checkedResumes.findIndex(indexResume => indexResume.ID == resume.ID);
      this.checkedResumes.splice(index, 1);
      this.removeOccupation(resume.occupation);
    }

    this.selectedResumeEmitter.emit(this.checkedResumes);
  }

  removeResume(resume: Resume): void {
    const index = this.checkedResumes.indexOf(resume);
    if (index >= 0) {
      this.checkedResumes.splice(index, 1);
    }

    this.removeOccupation(resume.occupation);
    this.selectedResumeEmitter.emit(this.checkedResumes);
  }

  isChecked(resume: Resume){
    if(this.checkedResumes.find(indexResume => indexResume.ID == resume.ID)){
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






  addOccupation(occupationString: string){
    const index = this.occupationTypes.findIndex(occupation => occupation.occupation === occupationString);
    if(index != -1){this.occupationTypes[index].count++;}
    else{this.occupationTypes.push({occupation: occupationString, count: 1});}
    this.totalOccupation.count = this.checkedResumes.length;
  }

  removeOccupation(occupationString: string){
    const index = this.occupationTypes.findIndex(occupation => occupation.occupation === occupationString);
    if(this.occupationTypes[index].count > 1){this.occupationTypes[index].count--;}
    else{this.occupationTypes.splice(index, 1);}
    this.totalOccupation.count = this.checkedResumes.length;
  }

  removeAllOccupations(){
    this.checkedResumes = [];
    this.occupationTypes = [];
    this.totalOccupation.count = this.checkedResumes.length;
  }

}
