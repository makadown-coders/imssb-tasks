import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-inline-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './inline-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class InlineFormComponent {
    @Input() title: string = '';
    @Input() defaultText: string = 'No definido';
    @Input() hasButton: boolean = false;
    @Input() buttonText: string = 'Enviar';
    @Input() inputPlaceholder: string = '';
    @Input() inputType: string = 'input';

    @Output() handleSubmit = new EventEmitter<string>();

    isEditing: boolean = false;

    form: FormGroup;
    fb = inject(FormBuilder);

    constructor() {
        this.form = this.fb.group({
            title: ['']
        })
    }
    
    /**
     * Activa el formulario para editar el título.
     * Si el título no se encuentra vacío, se establecerá como valor predeterminado en el formulario.
     * Se establecerá isEditing en verdadero.
     */
    activeEditing(): void {
        if (this.title) {
          this.form.patchValue({ title: this.title });
        }
        this.isEditing = true;
      }
    
    /**
     * Emite el valor enviado mediante el emisor del evento handleSubmit.
     * Si el valor está vacío, no se emitirá nada.
     * Después del envío, se restablecerá el formulario y se establecerá isEditing en falso.
     */
      onSubmit(): void {
        if (this.form.value.title) {
          this.handleSubmit.emit(this.form.value.title);
        }
        this.isEditing = false;
        this.form.reset();
      }
  }