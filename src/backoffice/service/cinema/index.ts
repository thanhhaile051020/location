import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Cinema, CinemaFilter, cinemaModel, CinemaService } from './cinema';

export * from './cinema';

export class CinemaClient extends Client<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, cinemaModel);
    this.searchGet = true;
    this.getCinemasByRole = this.getCinemasByRole.bind(this);
  }
  getCinemasByRole(id: string): Promise<Cinema[]> {
    const url = `${this.serviceUrl}`;
    return this.http.get<Cinema[]>(url);
  }
}
