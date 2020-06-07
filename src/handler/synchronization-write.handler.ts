import { Repository } from 'typeorm';
import { SynchronizationWriteHandlerInterface } from './synchronization-write-handler.interface';
import { AbstractSynchronizable } from '../abstract/AbstractSynchronizable';

export class SynchronizationWriteHandler<T extends AbstractSynchronizable>
  implements SynchronizationWriteHandlerInterface<T> {
  async saveChanges(
    transactionalRepository: Repository<T>,
    created: any[],
    updated: any[],
    lastModifiedAt: Date,
  ): Promise<void> {
    await this.add(transactionalRepository, created, lastModifiedAt);
    await this.update(transactionalRepository, updated, lastModifiedAt);
  }

  protected async add(
    transactionalRepository: Repository<T>,
    created: any[],
    lastModifiedAt: Date,
  ): Promise<void> {
    for (const item of created) {
      // @todo handle and log when entity already exists
      const instance: any = transactionalRepository.create(item);
      instance.serverCreatedAt = lastModifiedAt;
      instance.lastModifiedAt = lastModifiedAt;
      await transactionalRepository.save(instance);
    }
  }

  protected async update(
    transactionalRepository: Repository<T>,
    updated: any[],
    lastModifiedAt: Date,
  ): Promise<void> {
    for (const item of updated) {
      const instance: any = await transactionalRepository.preload(item);

      // entity is not in db, @todo log this problem
      if (null === instance.serverCreatedAt) {
        instance.serverCreatedAt = lastModifiedAt;
      }
      await transactionalRepository.save(instance);
    }
  }
}
