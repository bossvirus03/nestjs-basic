import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) { }
  @ResponseMessage("create a rule")
  @Post()
  async create(@Body() createRuleDto: CreateRuleDto, @User() user: IUser){
    const newRule = await this.rulesService.create(createRuleDto, user);
    return {
      createdAt: new Date,
      _id: newRule._id
    }
  }

  @Get()
  findAll(
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string) {
    return this.rulesService.findAll(limit, currentPage, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto, @User() user: IUser) {
    return this.rulesService.update(id, updateRuleDto, user);
  }

  @ResponseMessage("delete a rule")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rulesService.remove(id, user);
  }
}
