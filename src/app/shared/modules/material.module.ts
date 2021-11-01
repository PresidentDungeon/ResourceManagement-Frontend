import { NgModule } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
    declarations: [],
    imports: [
    ],
    exports: [
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule,
      MatSelectModule,
      MatOptionModule,
      MatSnackBarModule,
      MatCardModule,
      MatProgressBarModule
    ],
    providers: []
  })

  export class MaterialModule { }
