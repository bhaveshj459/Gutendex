import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  base_url = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }
  getAllBooks(nextUrl?: string, genre?: any, searchQuery?: any):Observable<any>{
    let params:any = {mime_type: 'image/jpeg'};
    let url = '';
    if(nextUrl){
      url = nextUrl.replace('http://localhost:8005',this.base_url);
    }
    else{
      url = this.base_url+ '/books/?';
      params['topic'] = genre;
      if(searchQuery){
        params['search'] = searchQuery;
      }
    }
    return this.httpClient.get(url, { params: params });
  }

  get(url: any): Observable<any>{
    return this.httpClient.get(url);
  }


}
