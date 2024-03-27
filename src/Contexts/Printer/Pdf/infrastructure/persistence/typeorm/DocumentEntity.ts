import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DocumentStatus } from '../../../domain/models/Document';

@Entity('documents')
export class DocumentEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { nullable: false })
  name!: string;
  @Column('text', { nullable: true })
  content: string | undefined;
  @Column({
    type: "enum",
    enum: DocumentStatus,
    default: DocumentStatus.Pending,
  })  status: string | undefined;
}
