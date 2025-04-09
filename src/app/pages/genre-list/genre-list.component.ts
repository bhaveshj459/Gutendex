import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genres } from 'src/app/models/genres';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css']
})
export class GenreListComponent implements OnInit {
  title = "Gutenberg Project";
  subtitle = "A social cataloging website that allows you to freely search its database of books, annotations, and reviews.";
  iconsBaseUrl = '/assets/';
  genresEnum = Genres;
  genres = Object.values(Genres);

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routeToGenre(path: string){
    this.router.navigateByUrl(`${environment.clientBaseUrl}/genre/` + path);
  }

}
