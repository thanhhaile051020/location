import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { LocationService } from './location/location';
import { LocationClient } from './location';
export * from './location';
axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  location_url: string;
}
class ApplicationContext {
  locationService?: LocationService;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getLocationService = this.getLocationService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }

  getLocationService(): LocationService {
    if (!this.locationService) {
      const c = this.getConfig();
      this.locationService = new LocationClient(httpRequest, c.location_url);
    }
    return this.locationService;
  }

}

export const context = new ApplicationContext();

export function useLocation(): LocationService {
  return context.getLocationService();
}

