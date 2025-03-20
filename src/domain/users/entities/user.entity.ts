import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
  } from 'typeorm';
  import { CommonEntity } from 'src/common/entities/common.entity';
  import { Profile } from './profile.entity';
  import { Exclude } from 'class-transformer';

  
  export enum Provider {
    Local = 'Local',
    Naver = 'Naver',
    Kakao = 'Kakao',
    Google = 'Google',
    Apple = 'Apple',
  }
  
  export enum UserStatus {
    Active = 'Active',
    Restriction = 'Restriction',
    Withdrawal = 'Withdrawal',
    Suspended = 'Suspended',
  }
  
  @Index('email', ['email'], { unique: false })
  @Index('userCode', ['userCode'], { unique: true })
  @Entity({
    name: 'USER',
  })
  export class User extends CommonEntity {
    @Column({ type: 'varchar', unique: false, nullable: false })
    email: string;
  
    @Column({ type: 'varchar', nullable: true })
    @Exclude()
    password?: string;
  
    @Column({ type: 'int', nullable: false, default: 0 })
    sanctionCount: number;
  
    @Column({ type: Date, nullable: true })
    sanctionDate: Date;
  
    @Column({ type: 'int', nullable: false, default: 0 })
    reportCount: number;
  
    @Column({ type: 'boolean', nullable: false, default: true })
    essentialAgree: boolean;
  
    @Column({ type: 'boolean', nullable: false, default: false })
    customizedServiceAgree: boolean;
  
    @Column({ type: 'boolean', nullable: false, default: false })
    marketingAgree: boolean;
  
    @Column({
      type: 'varchar',
      nullable: false,
    })
    userCode: string;
  
    @Column({ type: 'enum', enum: Provider, default: Provider.Local })
    provider: Provider;
  
    @Column({ type: 'varchar', nullable: true })
    refreshToken: string;
  
    @Column({ type: Date, nullable: true })
    refreshExp: Date;
  
    @Column({ type: 'varchar', nullable: true })
    fcm: string;
  
    @Column({ type: 'varchar', nullable: true, default: null })
    phone: string;
  
    @Column({ type: 'varchar', nullable: true, default: null })
    name: string;
  
    @Column({ type: 'varchar', nullable: true, default: null })
    birth: string;
  
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
    userStatus: UserStatus;
  
    @Column({ type: 'boolean', default: false })
    paid: boolean;
  
    @OneToOne(() => Profile, (profile) => profile.userId, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    })
    profile?: Profile;
  }