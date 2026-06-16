import { bootstrapApplication } from '@angular/platform-browser';

(window as any).global = window;

// Solución global para evitar que Angular/JS convierta las fechas locales a UTC (lo que causa desfase de días)
Date.prototype.toJSON = function () {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, '0');
  const day = String(this.getDate()).padStart(2, '0');
  const hours = String(this.getHours()).padStart(2, '0');
  const minutes = String(this.getMinutes()).padStart(2, '0');
  const seconds = String(this.getSeconds()).padStart(2, '0');
  const milliseconds = String(this.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
