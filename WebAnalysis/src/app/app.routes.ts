import { Routes } from "@angular/router";
// import { AuthGuard } from "@fusion/guard/auth.guard";

export const routes: Routes = [
  {
    path: "",
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import("./features/home/home.component").then(
        (m) => m.HomeComponent
      ),
  },
//   {
//     path: "connexion",
//     loadComponent: () =>
//       import("./features/login/login.component").then((m) => m.LoginComponent),
//   },
  {
    path: "**",
    redirectTo: "",
  },
];
