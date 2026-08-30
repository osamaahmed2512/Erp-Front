import { EnvironmentProviders, importProvidersFrom } from '@angular/core';

import { APP_ICONS } from '../icons/icons';
import { LucideAngularModule } from 'lucide-angular/src/icons';

export const lucideIconsProvider: EnvironmentProviders =
  importProvidersFrom(LucideAngularModule.pick(APP_ICONS));