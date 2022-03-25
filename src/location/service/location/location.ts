import { Model, ResultInfo } from 'onecore';
import { GenericSearchService, Filter, Attributes, Service } from 'onecore';
export interface Location {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  type: string;
  info: LocationInfo;
}
// filter
export interface LocationFilter extends Filter {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

export interface LocationService extends Service<Location, string, LocationFilter> {
  getLocationByType(type: string): Promise<Location[]>;
  rateLocation(obj: LocationRate): Promise<any>;
}

export const locationModel: Attributes = {
  id: {
    key: true,
    required: true,
    q: true
  },
  name: {
    required: true,
    q: true
  },
  description: {
    required: true,
    q: true
  },
  longitude: {
    type: 'number',
    required: true,
    q: true
  },
  latitude: {
    type: 'number',
    required: true,
    q: true
  }
};

export interface LocationRate {
  rateId?: string;
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
}

export interface LocationInfo {
  locationInfoId?: string; // It's is id
  viewCount: number;
  rateLocation: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
}
