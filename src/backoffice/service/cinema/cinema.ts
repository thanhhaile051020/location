import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface CinemaFilter extends Filter {
  id?: string;
  name?: string;
  address?: string;
  status?: string;
  parent?: string;
}
export interface Cinema extends Tracking {
  id: string;
  name: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  address?: string;
  parent?: string;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}
export interface CinemaService extends Service<Cinema, string, CinemaFilter> {
  getCinemasByRole(id: string): Promise<Cinema[]>;
}


export const cinemaModel: Attributes = {
  id: {
    key: true,
    length: 40
  },
  name: {
    required: true,
    length: 255,
  },
  latitude: {
    length: 255,
  },
  longitude: {
    length: 255,
  },
  address: {
    length: 255,
  },
  parent: {
    length: 40
  },
  status: {
    length: 1
  },
  createdBy: {},
  createdAt: {
    column: 'createdat',
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    column: 'createdat',
    type: 'datetime'
  }
};

