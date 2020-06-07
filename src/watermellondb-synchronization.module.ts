import { DynamicModule, Module } from '@nestjs/common';
import { SynchronizationService } from './service/synchronization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleOptionsInterface } from './interfaces/module-options.interface';
import { SynchronizationController } from './controller/synchronization.controller';
import { WATERMELLONDB_SYNCHRONIZATION_MODULE_OPTIONS } from './watermellondb-synchronization.constants';

@Module({})
export class WatermellondbSynchronizationModule {
  static register(options: ModuleOptionsInterface): DynamicModule {
    return {
      module: WatermellondbSynchronizationModule,
      imports: [TypeOrmModule.forFeature([])],
      controllers: [SynchronizationController],
      providers: [
        SynchronizationService,
        {
          provide: WATERMELLONDB_SYNCHRONIZATION_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
