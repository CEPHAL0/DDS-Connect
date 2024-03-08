import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormsService } from '../services/forms.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { CreateFormDto } from '../dtos/create-form.dto';

@Roles(Role.Admin, Role.Member)
@Controller('forms')
export class FormsController {
    @Inject() 
    private readonly formsService: FormsService;

    @Roles(Role.Admin, Role.Member, Role.User)
    @Get()
    index(){
        return {"message":"Hello world"}
    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    createOne(@Body() createFormDto: CreateFormDto){
        return createFormDto;
    }

    
}
