import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices'

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @GrpcMethod('BookingService', 'CreateEvent')
  createEvent(data: any) {
    return this.appService.createEvent(data);
  }

  @GrpcMethod('BookingService', 'DeleteEvent')
  deleteEvent(data:any) {
    return this.appService.deleteEvent(data);
  }

  @GrpcMethod('BookingService', 'UpdateEvent')
  updateEvent(data: any) {
    return this.appService.updateEvent(data);
  }
  
  @GrpcMethod('BookingService', 'GetEvents')
  getEvents() {
    return this.appService.getEvents();
  }
  
  @GrpcMethod('BookingService', 'GetEventDetails')
  getEventDetails(data: any) {
    return this.appService.getEventDetails(data);
  }
  
  @GrpcMethod('BookingService', 'ReserveSeat')
  reserveSeat(data: any) {
    return this.appService.reserveSeat(data);
  }
  
  @GrpcMethod('BookingService', 'ConfirmBooking')
  confirmBooking(data: any) {
    return this.appService.confirmBooking(data);
  }

  @GrpcMethod('BookingService', 'CreateVenue')
  createVenue(data: any) {
    return this.appService.createVenue(data);
  }

  @GrpcMethod('BookingService', 'GetVenues')
  getVenues() {
    return this.appService.getVenues();
  }

  @GrpcMethod('BookingService', 'DeleteVenue')
  deleteVenue(data: any) {
    return this.appService.deleteVenue(data);
  }

  @GrpcMethod('BookingService', 'UpdateVenue')
  updateVenue(data: any) {
    return this.appService.updateVenue(data);
  }

}
