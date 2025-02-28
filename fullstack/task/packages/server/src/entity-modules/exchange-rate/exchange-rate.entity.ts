import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'exchange_rate' })
export class ExchangeRate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    country!: string;

    @Column()
    currency!: string;

    @Column()
    amount!: number;

    @Column()
    currencyCode!: string;

    @Column('float')
    rate!: number;

    @Column()
    validFor!: string;

    @CreateDateColumn({ type: 'timestamp' })
    fetchedAt!: Date;
}
