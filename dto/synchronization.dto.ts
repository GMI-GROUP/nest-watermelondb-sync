import { ChangesDto } from './changes.dto';

export class SynchronizationDto {
  changes: { [entity: string]: ChangesDto<object> } = {};
  lastPulledAt: number;
}
