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
  
  @GrpcMethod('BookingService', 'GetEvents')
  getEvents(data: any) {
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
  
}
