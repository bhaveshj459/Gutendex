import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, fromEvent, map, debounceTime, merge } from 'rxjs';
import { Book } from 'src/app/models/book';
import { BookDataService } from 'src/app/services/book-data.service';
import { unzipSync } from 'fflate';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  searchIconUrl: String = '/assets/Search.svg';
  cancelIconUrl: String = '/assets/Cancel.svg';
  backIconUrl: String = '/assets/Back.svg';
  @ViewChild('searchBox') searchBox!: ElementRef;
  searchQuery: String = "";
  genreName: any;
  books: Book[] = [];
  @ViewChild('anchor') anchor!: ElementRef;
  nextPageUrl: any;
  options = {
    root: null
  };
  searchBoxSubscription!: Subscription;
  isLoading = true;

  private intersectionObserver!: IntersectionObserver;

  constructor(private route: ActivatedRoute, private router: Router, private booksService: BookDataService, private host: ElementRef) {
  }
  
  ngOnDestroy(): void {
    this.searchBoxSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.genreName = this.route.snapshot.paramMap.get('genreName');
  }

  ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.getMoreBooks();
    }, this.options);
    this.intersectionObserver.observe(this.anchor.nativeElement);

    const keyup$ = fromEvent(this.searchBox.nativeElement, 'keyup').pipe(
      map((event: any) => !event.altKey && event.keyCode !== 32)
    );
  
    const input$ = fromEvent(this.searchBox.nativeElement, 'input').pipe(
      map(() => true)
    );
  
    this.searchBoxSubscription = merge(keyup$, input$)
      .pipe(debounceTime(700))
      .subscribe((shouldSearch: boolean) => {
        if (shouldSearch) {
          this.nextPageUrl = undefined;
          this.books = [];
          this.getMoreBooks();
        }
      });
  
  }

  getMoreBooks() {
    this.isLoading = true;
    this.booksService.getAllBooks(this.nextPageUrl, this.genreName, this.searchQuery).subscribe({
      next: (res: { count: number; results: any[]; next: string; }) => {
        if (res.count === 0) {
          this.isLoading = false;
        }
        else {
          res.results.forEach((book: { id: any; title: any; authors: any[]; formats: { [x: string]: any; }; }) => {
            this.books.push({
              id: book.id,
              title: book.title,
              authors: book.authors.map((author: { name: any; }) => { return author.name }).join(','),
              cover: book.formats['image/jpeg'],
              book_url: this.getBookUrl(book.formats)
            });
          });
        }
        this.nextPageUrl = res.next;
      },
      error:(err: any) => {
        this.isLoading = false;
      }
    });
  }

  findPropertyNameByRegex(o: any, r: RegExp) {
    for (var key in o) {
      if (key.match(r)) {
        return key;
      }
    }
    return undefined;
  };

  getBookUrl(book: { [x: string]: any; }) { /* Returns book url by priority */
    const mimeTypes = [/text\/html/, /application\/pdf/, /text\/plain/, /application\/octet-stream/];

    for (const type of mimeTypes) {
      const key = this.findPropertyNameByRegex(book, type);
      if (key) {
        return book[key];
      }
    }

    return '';
  }

  goBack() {
    this.router.navigateByUrl(environment.clientBaseUrl);
  }

  openBook(book_url: String) {
    if (book_url === undefined) {
      alert('No Viewable Version Available');
    }
    else {
      if (book_url.includes('.zip')) {
        try {
          fetch(book_url as string)
            .then(res => res.arrayBuffer())
            .then(buffer => {
              const zipData = new Uint8Array(buffer);
              const files = unzipSync(zipData);
      
              let fileKey = '';
              let mimeType = '';
      
              const fileNames = Object.keys(files);
      
              const findKey = (regex: RegExp) => fileNames.find(name => regex.test(name));
      
              fileKey = findKey(/\/*\.htm[l]?$/i) || '';
              if (fileKey) {
                mimeType = 'text/html';
              } else {
                fileKey = findKey(/\/*\.pdf$/i) || '';
                if (fileKey) {
                  mimeType = 'application/pdf';
                } else {
                  fileKey = findKey(/\/*\.txt$/i) || '';
                  if (fileKey) {
                    mimeType = 'text/plain';
                  } else {
                    alert('No Viewable Version Available');
                    return;
                  }
                }
              }

              const fileContent = files[fileKey];
              const blob = new Blob([fileContent], { type: mimeType });
              const reader = new FileReader();
      
              reader.onloadend = () => {
                const base64data = reader.result as string;
                const newWindow = window.open('');
                newWindow?.document.write(
                  `<iframe width="100%" height="100%" src="${base64data}"></iframe>`
                );
              };
      
              reader.readAsDataURL(blob);
            });
        } catch (e) {
          alert('No Viewable Version Available');
        }
      }
      
      else {
        window.open(book_url as string);
      }
    }
  }

}
