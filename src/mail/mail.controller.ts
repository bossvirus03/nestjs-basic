import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schema/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schema/job.schema';
import { Cron } from '@nestjs/schedule';
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name) 
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) 
    private jobsModel: SoftDeleteModel<JobDocument>,
    ) {}
  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron('0 0 0 * * 0')//auto send email every 0:0':00" sunday
  async handleTestEmail() {
  const subscribers = await this.subscriberModel.find({})
  for(const subs of subscribers) {
    const subsSkills = subs.skills;
    const JobWatchingSkills = await this.jobsModel.find({skills: {$in: subsSkills}})
    if(JobWatchingSkills?.length){
      const jobs = JobWatchingSkills.map(item => {
        return {
          name: item.name,
          company: item.company.name,
          skills: item.skills,
          salary: item.salary
        }
      })
      await this.mailerService.sendMail({
      to: "nguyenhuuloi17032004@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: "new-job",
      context: {
        receiver: subs.name,
        jobs: jobs,
      }
    });
    }
  }
    
  }
}
