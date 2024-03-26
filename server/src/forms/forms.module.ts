import { Module } from '@nestjs/common';
import { FormsController } from './controllers/forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [FormsController],
  providers: [],
})
export class FormsModule {}
