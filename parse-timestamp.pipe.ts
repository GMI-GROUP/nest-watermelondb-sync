import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseTimestampPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    const date = new Date(+value);
    date.setMilliseconds(0);

    return date;
  }
}
