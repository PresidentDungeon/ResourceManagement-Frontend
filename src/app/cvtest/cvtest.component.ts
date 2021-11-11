import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackMessage} from "../shared/helpers/snack-message";
import {Worker} from "../test2/test2.component";

@Component({
  selector: 'app-cvtest',
  templateUrl: './cvtest.component.html',
  styleUrls: ['./cvtest.component.scss']
})

export class CvtestComponent implements OnInit {

  constructor(private snackbar: SnackMessage) {}

  @Input() isAdminPage: boolean;
  @Input() displayPagination: boolean;
  @Input() displaySelect: boolean;
  @Input() displayUserInfo: boolean;
  @Input() dataSource: Worker[] = [];
  @Output() selectedWorkerEmitter = new EventEmitter();

  displayedColumnsWithSelect: string[] = ['candidates', 'select'];
  displayedColumnsWithoutSelect: string[] = ['candidates'];

  displayedColumns: string[];
  selectedWorker?: Worker;

  snackbarRef: MatSnackBarRef<any>;

  pageSizeOptions: number[] = [25, 50, 75, 100];
  pageSize: number = 25;
  pageLength: number = 0;
  currentPage: number = 0;

  checkedWorkers: Worker[] = [];

  ngOnInit(): void {
    this.displayedColumns = (this.displaySelect) ? this.displayedColumnsWithSelect : this.displayedColumnsWithoutSelect;

    if(this.dataSource.length == 0){
      console.log('Getting CVs');
      //this.getCVs();
    }
  }

  getCVs(){
    this.snackbarRef = this.snackbar.open('');

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.pageSize}`;
  }

  onSelect(worker: Worker): void {
    this.selectedWorker = worker;
  }

  onPaginationChange($event){
    this.currentPage = $event.pageIndex;
    this.getCVs();
  }

  checkChange(worker: Worker, $event: any){
    const checked: boolean = $event.checked;

    if(checked){
      this.checkedWorkers.push(worker);
    }
    else{
      const index: number = this.checkedWorkers.findIndex(indexWorker => indexWorker.ID == worker.ID);
      this.checkedWorkers.splice(index, 1);
    }

    this.selectedWorkerEmitter.emit(this.checkedWorkers);
  }

  isChecked(worker: Worker){
    if(this.checkedWorkers.find(indexWorker => indexWorker.ID == worker.ID)){
      return true;
    }
    return false;
  }

}
