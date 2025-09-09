import { Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export abstract class BaseTimestampEntity {
  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @BeforeInsert()
  setCreatedAt() {
    const now = Math.floor(Date.now() / 1000); // epoch seconds
    this.created_at = now;
    this.updated_at = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = Math.floor(Date.now() / 1000);
  }
}
