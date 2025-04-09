import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list.component';
import { GenreListComponent } from './pages/genre-list/genre-list.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [  
  { path:environment.clientBaseUrl, component:GenreListComponent },
  { path:`${environment.clientBaseUrl}/genre/:genreName`, component:BookListComponent },
  { path:'', redirectTo:environment.clientBaseUrl , pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
