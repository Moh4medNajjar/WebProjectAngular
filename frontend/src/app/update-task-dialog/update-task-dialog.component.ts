import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ReactiveFormsModule ,FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Task } from '../task.model';
// import { DateAdapter } from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
@Component({
  selector: 'app-update-task-dialog',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.scss',
  
})
export class UpdateTaskDialogComponent {
  updateTaskForm: FormGroup;
  priorities = ['High', 'Medium', 'Low'];
  statuses = ['Todo', 'In Progress', 'Done'];

  minDate: Date;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredcategories: Observable<string[]>;
  categories: string[] = [];
  allcategories: string[] = ['Frontend', 'Web', 'Backend', 'Mobile', 'Desktop'];

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;


  // allusers: string[] = [];
  // participantCtrl = new FormControl('');
  // filteredparticipants: Observable<string[]>;
  // participants: string[] = [];
  // allparticipants: string[] = [];

  // @ViewChild('participantInput') participantInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);




  constructor(
    private dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    private fb: FormBuilder,
    // private dateAdapter: DateAdapter<any>
  ) {
    this.updateTaskForm = this.fb.group({
      title: [data.task.title, Validators.required],
      description: [this.data.task.description, Validators.required],
      due_date: [this.data.task.due_date, Validators.required],
      priority: [this.data.task.priority, Validators.required],
      status: [this.data.task.status, Validators.required],
      category: [this.data.task.category],
      // participants: [this.data.task.participants],
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear);

    this.filteredcategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => (category ? this._filter(category) : this.allcategories.slice())),
    );

    // this.filteredparticipants = this.participantCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((participant: string | null) => (participant ? this._filter(participant) : this.allparticipants.slice())),
    // );
  }

  // changeLocale(locale: any){
  //   this.dateAdapter.setLocale(locale);
  // };

  

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our category
    if (value) {
      this.categories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);

      this.announcer.announce(`Removed ${category}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allcategories.filter(category => category.toLowerCase().includes(filterValue));
  }


  // addParticipant(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = (event.value || '').trim();

  //   // Add participant
  //   if (value) {
  //     const participantsControl = this.updateTaskForm.get('participants');
  //     participantsControl.setValue([...participantsControl.value, value]);
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  // removeParticipant(participant: string): void {
  //   const participantsControl = this.updateTaskForm.get('participants') as FormArray;
  //   const index = participantsControl.value.indexOf(participant);

  //   if (index >= 0) {
  //     participantsControl.value.splice(index, 1);
  //     participantsControl.setValue([...participantsControl.value]);
  //   }
  // }






  save() {
    if (this.updateTaskForm.valid) {
      this.dialogRef.close(this.updateTaskForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
