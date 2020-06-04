export class ChangesDto<T extends object> {
  created: T[] = [];
  updated: T[] = [];
  deleted: string[] = [];
}
