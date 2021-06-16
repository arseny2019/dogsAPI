import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { BreedsList, DogsResponse } from './dogs.model';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: [ './dogs.component.scss' ]
})
export class DogsComponent implements OnInit {
  breeds?: BreedsList;
  activeBreed?: string;
  src: string = 'http://conf2021.tsnigri.ru/sites/default/files/styles/1200x900/public/2018-03/mt-event-4.jpg';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.http.get<DogsResponse>(environment.breedsListURL)
      .pipe(
        map(r => (<BreedsList>{ breeds: Object.keys(r.message).slice(0, 10) }))
      )
      .subscribe(
        r => this.breeds = r
      );
    this.route.params.subscribe(d => {
      if (d.breed) {
        this.activeBreed = d.breed;
        this.http.get<DogsResponse>(`https://dog.ceo/api/breed/${d.breed}/images/random`).subscribe(
          r => this.src = <string>r.message,
          error => console.log('Ошибка!', error.error.message)
        )
      }
    });
  }

  breedChange(breed: string) {
    this.router.navigate([ '', breed ]);
  }
}
