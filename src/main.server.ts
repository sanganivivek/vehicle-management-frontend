import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig as config } from './app/app.config';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;