import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Cinema, CinemaFilter, cinemaModel, CinemaService } from './cinema';

export * from './cinema';

export class CinemaClient extends Client<Cinema, string, CinemaFilter> {
  constructor(http: HttpRequest, url: string) {
    super(http, url, cinemaModel);
    this.searchGet = true;
  }
}
