import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./entity-utilites/BaseEntity";
import { Business } from "./business.entity";

@Entity('cake_options')
@Unique(['businessId', 'category', 'name'])
export class CakeOption extends BaseEntity{
    @Column({ name: "business_id", type: "uuid" })
    businessId: string;

    @Column({ type: 'varchar', length: 30 })
    category: string;

    @ManyToOne(() => Business)
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @Column({ type: 'varchar', length: 100 })
    name: string

    @Column({ type: 'boolean', default: true })
    active: boolean
}