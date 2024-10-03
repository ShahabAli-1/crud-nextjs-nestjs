import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { Package, PackageSchema } from './schemas/package.schema';
import { PackagesRepository } from './repositories/packages.repository';
import { ServicesModule } from '../services/services.module'; // Import ServicesModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    forwardRef(() => ServicesModule), // Use forwardRef to handle circular dependency
  ],
  controllers: [PackagesController],
  providers: [PackagesService, PackagesRepository],
  exports: [PackagesService, PackagesRepository],
})
export class PackagesModule {}
