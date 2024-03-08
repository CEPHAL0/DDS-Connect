import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFormDto } from '../dtos/create-form.dto';

@Injectable()
export class FormsService {

    @InjectRepository(Form)
    private readonly formsRepository: Repository<Form>

    async createForm(createFormDto: CreateFormDto){
        const date = new Date().toJSON().slice(0,10)
        const formData:Omit<Form, "id"> = {...createFormDto, createdOn: date, status:"open"}
        const result = await this.formsRepository.save(formData);
    }
}
