import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { LucideAngularModule } from "lucide-angular/src/icons";

@Component({
  selector: 'app-create-page',
  imports: [LucideAngularModule,CommonModule ],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
  standalone:true
})
export class CreatePageComponent {
  @Input() entityName = 'Item';
  @Input() isSaving = false;

  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>(); 
 
  
}
