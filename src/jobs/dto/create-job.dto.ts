import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateJobDto {  
    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;

    @IsNotEmpty({
        message: "skills không được để trống"
    })
    skills: string[];

    @IsNotEmpty({
        message: "company không được để trống"
    })
    company: {
         _id : string;
         name : string;
        };  
    
    @IsNotEmpty({
        message: "location không được để trống"
    })
    location: string; 

    @IsNotEmpty({
        message: "salary không được để trống"
    })
    salary: number;   

    @IsNotEmpty({
        message: "quantity không được để trống"
    })
    quantity: number;

    @IsNotEmpty({
        message: "level không được để trống"
    })
    level: string;

    @IsNotEmpty({
        message: "description không được để trống"
    })
    description: string;

    @IsNotEmpty({
        message: "startDate không được để trống"
    })
    startDate: string;
    @IsNotEmpty({
        message: "endDate không được để trống"
    })
    endDate: string;

    @IsNotEmpty({
        message: "sActive không được để trống"
    }) 
    sActive: boolean;

    // @IsNotEmpty({
    //     message: "location không được để trống"
    // })
    isDeleted: boolean;
}
