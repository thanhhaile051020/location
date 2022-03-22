import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options } from 'uione';
// import {BookableService} from '../service/BookableService';
// import {BookingService} from '../service/BookingService';
// import {BookableClient} from '../service/client/BookableClient';
// import {BookingClient} from '../service/client/BookingClient';
// import {EventClient} from '../service/client/EventClient';
import { LocationClient } from 'src/location/service/location';
// import {LocationRateClient} from '../service/client/LocationRateClient';
// import {TourClient} from '../service/client/TourClient';
// import {TripClient} from '../service/client/TripClient';
// import {EventService} from '../service/EventService';
// import {LocationRateService} from '../service/LocationRateService';
import { LocationService } from 'src/location/service/location/location';
// import {TourService} from '../service/TourService';
// import {TripService} from '../service/TripService';

const httpRequest = new HttpRequest(axios, options);
class ApplicationContext {
  private readonly locationService: LocationService;
  // private readonly locationRateService: LocationRateService;
  // private readonly tourService: TourService;
  // private readonly tripService: TripService;
  // private readonly bookingService: BookingService;
  // private readonly eventService: EventService;
  // private readonly bookableService: BookableService;
  constructor() {
    this.locationService = new LocationClient(httpRequest, '');
    // this.locationRateService = new LocationRateClient(httpRequest);
    // this.tourService = new TourClient(httpRequest);
    // this.tripService = new TripClient(httpRequest);
    // this.eventService = new EventClient(httpRequest);
    // this.bookingService = new BookingClient(httpRequest);
    // this.bookableService = new BookableClient(httpRequest);
  }
  getLocationService(): LocationService {
    return this.locationService;
  }
  // getLocationRateService(): LocationRateService {
  //   return this.locationRateService;
  // }
  // getTourService(): TourService {
  //   return this.tourService;
  // }
  // getTripService(): TripService {
  //   return this.tripService;
  // }
  // getBookingService(): BookingService {
  //   return this.bookingService;
  // }
  // getEventService(): EventService {
  //   return this.eventService;
  // }
  // getBookableService(): BookableService {
  //   return this.bookableService;
  // }
}

const applicationContext = new ApplicationContext();

export default applicationContext;
