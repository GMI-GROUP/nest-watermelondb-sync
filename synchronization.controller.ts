import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SynchronizationService } from './synchronization.service';
import { ParseTimestampPipe } from './parse-timestamp.pipe';
import { SynchronizationDto } from './dto/synchronization.dto';

@Controller('synchronization')
export class SynchronizationController {
  constructor(
    private readonly synchronizationService: SynchronizationService,
  ) {}

  @Get('/init')
  init(): Promise<SynchronizationDto> {
    return this.synchronizationService.initSynchronization();
  }

  @Get('/pull')
  async pull(
    @Query('last_pulled_at', new ParseTimestampPipe()) lastPulledAt: any,
  ): Promise<SynchronizationDto> {
    return this.synchronizationService.getChangesAfterTimestamp(lastPulledAt);
  }

  @Post('/push')
  async push(
    @Body() synchronizationDto: SynchronizationDto,
  ): Promise<void> {
    const date = new Date(synchronizationDto.lastPulledAt);
    date.setMilliseconds(0);
    synchronizationDto.lastPulledAt = date.getTime();

    return this.synchronizationService.saveChanges(synchronizationDto);
  }
}
