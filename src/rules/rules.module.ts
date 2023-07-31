import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rule, RuleSchema } from './schema/rule.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema }])],
  controllers: [RulesController],
  providers: [RulesService]
})
export class RulesModule {}
