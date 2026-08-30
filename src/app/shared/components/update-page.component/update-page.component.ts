import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from "lucide-angular/src/icons";

@Component({
  selector: 'app-update-page',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css',
})
export class UpdatePageComponent {
    @Input() entityName = 'Item';
    @Input() isSaving = false;

  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>(); 
}
