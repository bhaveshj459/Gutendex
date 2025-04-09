import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrls: ['./genre-card.component.css']
})
export class GenreCardComponent implements OnInit {
  @Input()
  genrelogoUrl!: String;
  @Input()
  genreName!: String;
  nextlogoUrl: String = '/assets/Next.svg';
  constructor() { }

  ngOnInit(): void {
  }

}
