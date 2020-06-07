import { Repository } from 'typeorm';
import { AbstractSynchrizableEntity } from '../abstract/synchronizable-entity.abstract';

export interface SynchronizationWriteHandlerInterface<
  T extends AbstractSynchrizableEntity
> {
  saveChanges(
    transactionalRepository: Repository<T>,
    created: any[],
    updated: any[],
    lastModifiedAt: Date,
  ): Promise<void>;
}
