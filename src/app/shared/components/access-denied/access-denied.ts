import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `<section class="min-h-full grid place-items-center p-8"><div class="max-w-md text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"><div class="text-4xl mb-3">🔒</div><h1 class="text-xl font-bold text-slate-900">Access denied</h1><p class="mt-2 text-sm text-slate-500">You do not have permission to open this page for the selected company.</p><a routerLink="/" class="inline-block mt-5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Go to an allowed page</a></div></section>`
})
export class AccessDenied {}
