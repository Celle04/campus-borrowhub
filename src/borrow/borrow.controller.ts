import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';

@Controller('borrowings')
export class BorrowingController {

  constructor(private service: BorrowingService) {}

  @Post('request')
  createRequest(@Body() body: any) {
    return this.service.createRequest(body);
  }

  @Get('requests')
  findAllRequests() {
    return this.service.findAllRequests();
  }

  @Put('requests/:id/approve')
  approveRequest(@Param('id') id: number) {
    return this.service.approveRequest(id);
  }

  @Put('requests/:id/reject')
  rejectRequest(@Param('id') id: number) {
    return this.service.rejectRequest(id);
  }

  @Post('return/:id')
  returnItem(@Param('id') id: number) {
    return this.service.returnItem(id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.service.findByUser(userId);
  }
}