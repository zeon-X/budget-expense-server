export class UserEntity {
  id!: string;
  email!: string;
  emailVerified!: boolean;
  name?: string;
  avatar?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
