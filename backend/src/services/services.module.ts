import { Module, forwardRef } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesRepository } from './service.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './service.model';
import { PackagesModule } from 'src/packages/packages.module'; // Importing PackagesModule
import { ServicesController } from './services.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    forwardRef(() => PackagesModule), // Use forwardRef to handle circular dependency
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
