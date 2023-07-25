import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './schemas/company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {CompanySchema } from './schemas/company.schema';
@Module({
  imports: [MongooseModule.forFeature([{name: Company.name, schema: CompanySchema}])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService]
})
export class CompaniesModule {}
