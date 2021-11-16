import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackMessage} from "../shared/helpers/snack-message";
import {Resume} from "../shared/models/resume";
import {ResumeService} from "../shared/services/resume.service";

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

  displayedColumnsWithSelect: string[] = ['candidates', 'select'];
  displayedColumnsWithoutSelect: string[] = ['candidates'];

  displayedColumns: string[];
  selectedResume?: Resume;

  snackbarRef: MatSnackBarRef<any>;

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  checkedResumes: Resume[] = [];

  ngOnInit(): void {
    this.displayedColumns = (this.displaySelect) ? this.displayedColumnsWithSelect : this.displayedColumnsWithoutSelect;

    if(this.dataSource.length == 0){
      console.log('Getting CVs');
      this.getResumes();
    }
  }

  getResumes(){
    this.snackbarRef = this.snackbar.open('');
    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}&sorting=ASC&sortingType=ADDED`;

    this.resumeService.getResumes(filter).subscribe((FilterList) => {
        this.pageLength = FilterList.totalItems;
        this.dataSource = FilterList.list;
      },
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
    }
    else{
      const index: number = this.checkedResumes.findIndex(indexResume => indexResume.ID == resume.ID);
      this.checkedResumes.splice(index, 1);
    }

    this.selectedResumeEmitter.emit(this.checkedResumes);
  }

  isChecked(resume: Resume){
    if(this.checkedResumes.find(indexResume => indexResume.ID == resume.ID)){
      return true;
    }
    return false;
  }

}
