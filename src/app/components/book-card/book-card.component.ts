import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {
  @Input() bookCoverUrl: any;
  @Input() bookTitle: any;
  @Input() bookAuthor: any;
  @Input() genreName: string = '';
  constructor() { }

  ngOnInit(): void {
  }
  //this has to be done because of url comming from backend is having some SSL certificate issue
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/' + this.genreName + '.svg';
  }
}
