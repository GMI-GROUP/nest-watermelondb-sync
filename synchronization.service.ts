import { Inject, Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { SynchronizationDto } from './dto/synchronization.dto';
import { SynchronizationReadHandlerInterface } from './handler/synchronization-read-handler.interface';
import { SynchronizationReadHandler } from './handler/synchronization-read.handler';
import { SynchronizationWriteHandlerInterface } from './handler/synchronization-write-handler.interface';
import { AbstractSynchronizable } from '../abstract/AbstractSynchronizable';
import { SynchronizationWriteHandler } from './handler/synchronization-write.handler';
import { MODULE_OPTIONS } from './module-opttion.const';
import { ModuleOptionsInterface } from './interfaces/module-options.interface';

function toPluralisedUnderScore(name: string): string {
  return (
    name
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase() + 's'
  );
}

@Injectable()
export class SynchronizationService {
  private readonly readEntities: Map<
    any,
    SynchronizationReadHandlerInterface<any>
  >;
  private readonly writableEntities: Map<
    any,
    SynchronizationWriteHandlerInterface<any>
  >;

  constructor(
    private readonly connection: Connection,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(MODULE_OPTIONS) options: ModuleOptionsInterface,
  ) {
    this.readEntities = new Map();
    for (const entity of options.readEntities) {
      this.readEntities.set(
        entity,
        new SynchronizationReadHandler(
          this.entityManager.getRepository(entity),
        ),
      )
    }

    this.writableEntities = new Map();
    for (const entity of options.writeEntities) {
      this.writableEntities.set(entity, new SynchronizationWriteHandler());
    }
  }

  public async initSynchronization(
  ): Promise<SynchronizationDto> {
    const synchronizationDto = new SynchronizationDto();
    synchronizationDto.lastPulledAt = new Date().getTime();

    for (const [entity, handler] of this.readEntities.entries()) {
      synchronizationDto.changes[
        toPluralisedUnderScore(entity.name)
      ] = await handler.initSynchronization();
    }

    return synchronizationDto;
  }

  public async getChangesAfterTimestamp(
    date: Date,
  ): Promise<SynchronizationDto> {
    const synchronizationDto = new SynchronizationDto();
    synchronizationDto.lastPulledAt = new Date().getTime();

    for (const [entity, handler] of this.readEntities.entries()) {
      synchronizationDto.changes[
        toPluralisedUnderScore(entity.name)
      ] = await handler.findChangesAfterDate(date);
    }

    return synchronizationDto;
  }

  public async saveChanges(
    synchronizationDto: SynchronizationDto,
  ) {
    const saveChangesTransaction = async transactionalEntityManager => {
      for (const [key, value] of Object.entries(synchronizationDto.changes)) {
        // this will handle:
        //   a) empty changes in writableEntity (optimization)
        //   b) non-writable entity without changes -
        //      patch logic of watermelonDB/mobile - collections are not divided by write access
        if (value.created.length === 0 && value.updated.length === 0) {
          continue;
        }

        const [entity, handler] = [...this.writableEntities.entries()].find(
          ([writableEntity]) =>
            key === toPluralisedUnderScore(writableEntity.name),
        );

        if (!entity) {
          throw new Error(`${key} entity collection is not marked as writable`);
        }

        // in other circumstances this should be provided by SynchronizationHandlerInterface
        if (0 !== value.deleted.length) {
          throw new Error('Entity deleting is forbidden');
        }

        const repository = transactionalEntityManager.getRepository(entity);

        await handler.saveChanges(
          repository,
          value.created,
          value.updated,
          new Date(synchronizationDto.lastPulledAt),
        );
      }
    };

    await this.connection.transaction(saveChangesTransaction);
  }
}
