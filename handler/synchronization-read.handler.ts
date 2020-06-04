import { Repository } from 'typeorm';
import { SynchronizationReadHandlerInterface } from './synchronization-read-handler.interface';
import { ChangesDto } from '../dto/changes.dto';
import { LessThanDate, MoreThanDate } from '../date-operations.helper';
import { AbstractSynchronizable } from '../../abstract/AbstractSynchronizable';

export class SynchronizationReadHandler<T extends AbstractSynchronizable>
  implements SynchronizationReadHandlerInterface<T> {
  constructor(protected repository: Repository<T>) {}

  async initSynchronization(): Promise<ChangesDto<T>> {
    const changesDto = new ChangesDto<T>();
    changesDto.created = await this.repository.find({
      where: { deleted: false },
    });
    return changesDto;
  }

  async findChangesAfterDate(
    lastModifiedAt: Date,
  ): Promise<ChangesDto<T>> {
    const changesDto = new ChangesDto<T>();

    changesDto.created = await this.repository.find({
      where: {
        serverCreatedAt: MoreThanDate(lastModifiedAt),
        lastModifiedAt: MoreThanDate(lastModifiedAt),
        deleted: false,
      },
    });

    changesDto.updated = await this.repository.find({
      where: {
        serverCreatedAt: LessThanDate(lastModifiedAt),
        lastModifiedAt: MoreThanDate(lastModifiedAt),
        deleted: false,
      },
    });

    changesDto.deleted = (await this.repository.find({
      where: {
        serverCreatedAt: LessThanDate(lastModifiedAt),
        lastModifiedAt: MoreThanDate(lastModifiedAt),
        deleted: true,
      },
      select: ['id'],
    })).map(entity => entity.id);

    return changesDto;
  }
}
