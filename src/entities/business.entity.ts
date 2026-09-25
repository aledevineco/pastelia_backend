import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./entity-utilites/BaseEntity";
import { User } from "./user.entity";

@Entity('businesses')
export class Business extends BaseEntity{
    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId: string
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ name: "business_name", type: "varchar", length: 150 })
    businessName: string

    @Column({ type: "varchar", length: 150, unique: true })
    slug: string

    @Column({
      type: 'varchar',
      length: 20,
      default: 'starter',
    })
    plan: string

    @Column({
      type: 'varchar',
      length: 20,
      default: 'active',
    })
    status: string
}