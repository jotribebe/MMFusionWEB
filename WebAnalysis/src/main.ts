import { AppComponent } from '@fusion/components';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@shared/app.config';

// if (environment.production) {
//   enableProdMode();
// }

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
