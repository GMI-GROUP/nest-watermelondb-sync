import { DynamicModule, Module } from '@nestjs/common';
import { SynchronizationController } from './synchronization.controller';
import { SynchronizationService } from './synchronization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleOptionsInterface } from './interfaces/module-options.interface';

@Module({})
export class SynchronizationModule {
  static register(options: ModuleOptionsInterface): DynamicModule {
    return {
      module: SynchronizationModule,
      imports: [
        TypeOrmModule.forFeature([]),
      ],
      controllers: [SynchronizationController],
      providers: [SynchronizationService,
        {
          provide: 'MODULE_OPTIONS',
          useValue: options,
        },
      ],
      // exports: [ConfigService],
    };
  }
}
