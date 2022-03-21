import { LocationInfo } from './LocationInfo';
import { Model, ResultInfo } from 'onecore';
import { GenericSearchService, Filter, Attributes, Service } from 'onecore';
import { } from 'onecore';
import { LocationRate } from './location-rate';
import { Attribute } from 'react-hook-core';
export interface Location {
  locationId: string;
  locationName: string;
  description: string;
  longitude: number;
  latitude: number;
  type: string;
  info: LocationInfo;
}
// filter
export interface LocationFilter extends Filter {
  locationId: string;
  locationName: string;
  description: string;
  longitude: number;
  latitude: number;
}


export interface LocationService extends Service<Location, string, LocationFilter> {
  getLocationByType(type: string): Promise<Location[]>;
  rateLocation(obj: LocationRate): Promise<any>;
}

export const locationModel: Attributes = {
  locationId: {
    type: 'object',
    field: '_id',
    key: true,
    required: true,
    q: true
  },
  locationName: {
    type: 'string',
    required: true,
    q: true
  },
  description: {
    type: 'string',
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
