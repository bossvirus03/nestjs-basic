import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RolesModule } from 'src/roles/roles.module';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: User.name, schema: UserSchema},
    {name: Role.name, schema: RoleSchema}])],
  controllers: [UsersController],
  providers: [UsersService, RolesModule],
  exports: [UsersService]
})
export class UsersModule {}
