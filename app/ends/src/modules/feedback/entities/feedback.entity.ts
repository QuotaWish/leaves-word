
import { IsNumber, IsString } from 'class-validator';
import { extend } from 'lodash';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity';
import { UserEntity } from '~/modules/user/user.entity';



@Entity('feedback')
export class FeedbackEntity extends CommonEntity {

  @Column({ type: "varchar", length: 255, nullable: true })
  feedId: string; // 这个字段用于存储自动生成的 feedId

  @Column({ nullable: true })
  allRate: number;

  @Column({
    type: 'enum',
    enum: ['BUG', 'UI', 'FEATURE', 'OTHER'],
    default: 'UI',
    nullable: true
  })
  feedType: string; // 注意这里使用字符串类型

  @Column({ type: "varchar", length: 255, nullable: true })
  feedDesc: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  feedSuggestion: string | null;


  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

}
