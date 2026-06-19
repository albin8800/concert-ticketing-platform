import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
  OnModuleInit,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { AdminGuard } from '../auth/admin.guard'; // Add this later when we build the Admin UI

// Define the gRPC interface so TypeScript knows what methods exist
interface BookingService {
  CreateEvent(data: any): any;
  GetEvents(data: any): any;
  GetEventDetails(data: any): any;
  ReserveSeat(data: any): any;
  ConfirmBooking(data: any): any;
}

@Controller('booking')
export class BookingController implements OnModuleInit {
  private bookingService: BookingService;

  constructor(@Inject('BOOKING_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.bookingService =
      this.client.getService<BookingService>('BookingService');
  }

  // --- Public Routes ---

  @Get('events')
  async getEvents() {
    return lastValueFrom(this.bookingService.GetEvents({}));
  }

  @Get('events/:id')
  async getEventDetails(@Param('id') id: string) {
    return lastValueFrom(this.bookingService.GetEventDetails({ eventId: id }));
  }

  // --- Protected Routes (Requires Login) ---

  @UseGuards(JwtAuthGuard)
  @Post('events/:id/reserve')
  async reserveSeat(
    @Param('id') eventId: string,
    @Body('ticketId') ticketId: string,
    @Req() req: any,
  ) {
    return lastValueFrom(
      this.bookingService.ReserveSeat({
        eventId: eventId,
        ticketId: ticketId,
        userId: req.user.userId, // Extracted from the JWT by the AuthGuard
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async confirmBooking(
    @Body() body: { reservationId: string; paymentId: string },
    @Req() req: any,
  ) {
    return lastValueFrom(
      this.bookingService.ConfirmBooking({
        reservationId: body.reservationId,
        paymentId: body.paymentId,
        userId: req.user.userId,
      }),
    );
  }

  // --- Admin Routes ---

  // @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/events')
  async createEvent(@Body() body: any) {
    return lastValueFrom(this.bookingService.CreateEvent(body));
  }
}
