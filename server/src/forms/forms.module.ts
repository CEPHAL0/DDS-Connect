import { Module } from '@nestjs/common';
import { FormsController } from './controllers/forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FormsService } from './services/forms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
