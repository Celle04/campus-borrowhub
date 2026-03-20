// borrow-request.entity.ts
import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinColumn, RelationId } from 'typeorm';
import { Item } from '../equipment/item.entity';
import { User } from '../users/user.entity';

@Entity()
export class BorrowRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @RelationId((request: BorrowRequest) => request.item)
  itemId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((request: BorrowRequest) => request.user)
  userId: number;

  @Column()
  quantity: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'date', nullable: true })
  requestDate: string;
}