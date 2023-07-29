import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from 'fs'
import { diskStorage } from "multer";
import path, { join } from "path";
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {

    getRootPath = () => {
        return process.cwd();
    };
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    // Error:
                    // Requested location already exists, but it's not a directory.
                    break;
                case 'ENOTDIR':
                    // Error:
                    // The parent hierarchy contains a file with the same name as the dir
                    // you're trying to create.
                    break;
                default:
                    // Some other error like permission denied.
                    console.error(error);
                    break;
            }
        });
    }
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({//diskStorage là nơi lưu trữ trong máy tính 
                destination: (req, file, cb) => {//địa chỉ nơi lưu trữ
                    const folder = req?.headers?.folder_type ?? "default";
                    this.ensureExists(`public/images/${folder}`);
                    cb(null, join(this.getRootPath(), `public/images/${folder}`))//calllback trả về cho destination địa chỉ của nơi lưu trữ
                },
                filename:
                 (req, file, cb) => {//tên file upload
                    //get image extension
                    let extName = path.extname(file.originalname);//get tên định dạng file

                    //get image's name (without extension)
                    let baseName = path.basename(file.originalname, extName);
                    let finalName = `${baseName}-${Date.now()}${extName}`
                    cb(null, finalName)//trả về cho filename tên của file upload sau khi đã chế biến
                }
            })//sau khi đã có tên và địa chỉ nơi lưu trữ
        };
    }
}