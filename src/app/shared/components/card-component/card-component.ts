import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

import { Ellipsis, LucideAngularModule, Percent, TrendingUp } from 'lucide-angular/src/icons';


@Component({
  selector: 'app-card-component',
  standalone:true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './card-component.html',
  styleUrl: './card-component.css',
})
export class CardComponent {
    @Input() title:string ='Total Revenue';
    @Input() Total:string = '$'+`100`;
    @Input() precentage:Number =2.8;

    icons= {Ellipsis,TrendingUp,Percent }
}
