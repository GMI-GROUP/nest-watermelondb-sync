import { ChangesDto } from '../dto/changes.dto';
import { AbstractSynchrizableEntity } from '../abstract/synchronizable-entity.abstract';

export interface SynchronizationReadHandlerInterface<
  T extends AbstractSynchrizableEntity
> {
  initSynchronization(): Promise<ChangesDto<T>>;

  findChangesAfterDate(lastModifiedAt: Date): Promise<ChangesDto<T>>;
}
