import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { User } from '../users/user.entity';
import { Item } from '../equipment/item.entity';

@Entity()
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.borrowings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((borrowing: Borrowing) => borrowing.user)
  userId: number;

  @ManyToOne(() => Item, item => item.borrowings)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @RelationId((borrowing: Borrowing) => borrowing.item)
  itemId: number;

  @Column()
  quantity: number;

  @Column()
  borrowDate: string;

  @Column()
  dueDate: string;

  @Column({ nullable: true })
  returnDate: string;

  @Column({ default: 'borrowed' })
  status: string; // borrowed, returned, overdue
}