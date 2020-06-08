import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AbstractSynchrizableEntity } from '../../../src/abstract/synchronizable-entity.abstract';

@Entity()
export class Post extends AbstractSynchrizableEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
