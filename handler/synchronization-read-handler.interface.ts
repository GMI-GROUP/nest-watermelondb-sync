import { ChangesDto } from '../dto/changes.dto';
import { AbstractSynchronizable } from '../../abstract/AbstractSynchronizable';

export interface SynchronizationReadHandlerInterface<
  T extends AbstractSynchronizable
> {
  initSynchronization(): Promise<ChangesDto<T>>;

  findChangesAfterDate(
    lastModifiedAt: Date,
  ): Promise<ChangesDto<T>>;
}
