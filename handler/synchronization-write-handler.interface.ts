import { Repository } from 'typeorm';
import { AbstractSynchronizable } from '../../abstract/AbstractSynchronizable';

export interface SynchronizationWriteHandlerInterface<
  T extends AbstractSynchronizable
> {
  saveChanges(
    transactionalRepository: Repository<T>,
    created: any[],
    updated: any[],
    lastModifiedAt: Date,
  ): Promise<void>;
}
