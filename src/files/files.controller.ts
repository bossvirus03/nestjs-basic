import { Controller, Get, Post, Body, Patch, Param, Delete, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Public } from 'src/decorator/customize';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }
  @Public()
  @Post('upload')
  /////*******\\\\\FileInterceptor(fieldName: string, localOptions?: MulterOptions)
  @UseInterceptors(FileInterceptor('file'))// cùng lúc này sẽ chạy vào option đó ở multer.config.ts để tiến hành lưu trữ file
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /image\/gif|image\/jpeg|application\/pdf|text\/plain|image\/png/,
      })
      .addMaxSizeValidator({
        maxSize: 1000 * 1024//đơn vị byte
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),) file: Express.Multer.File) {
    return file.filename;
  }
  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
