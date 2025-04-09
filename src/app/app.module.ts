import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenreCardComponent } from './components/genre-card/genre-card.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookListComponent } from './pages/book-list/book-list.component';
import { GenreListComponent } from './pages/genre-list/genre-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GenreCardComponent,
    BookCardComponent,
    BookListComponent,
    GenreListComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
