import { BeforeInsert, BeforeUpdate, Column, PrimaryColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

export abstract class AbstractSynchrizableEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  deleted: boolean;

  @Column()
  lastModifiedAt: Date;

  @Column()
  serverCreatedAt: Date;

  constructor() {
    this.id = uuid4();
    this.deleted = false;
  }

  @BeforeInsert()
  beforeInsert() {
    if (!this.lastModifiedAt) {
      this.lastModifiedAt = new Date();
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.lastModifiedAt = new Date();
  }
}
