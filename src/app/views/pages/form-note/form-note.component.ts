import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/services/@types/note';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';

  checkoutForm: FormGroup;
  subscriptionEdit: Subscription;
  isEditing:boolean;
  idNota: number;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
      this.checkoutForm = this.formBuilder.group({
        textNote: ['', [Validators.required, Validators.minLength(5)]],
      });

      this.isEditing = false;
      this.idNota = -1;
      this.subscriptionEdit = this.noteService.updateNoteProvider.subscribe({
          next: (note) => {
            this.isEditing = true;
            this.idNota = note.id;
            this.checkoutForm.controls['textNote'].setValue(note.text);
          }
      });
  }

  ngOnInit(): void {}

  sendNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      if(!this.isEditing){
        this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
          //next é chamado quando as coisas dão certo
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na inserção! " + error)
        });
      }else{
        this.noteService.putNote(this.idNota, this.checkoutForm.value.textNote).subscribe({
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na atualizacao! " + error),
          complete: () => {this.isEditing = false},
        });
      }
    }
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }
}
