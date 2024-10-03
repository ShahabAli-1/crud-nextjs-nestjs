import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackagesRepository } from './repositories/packages.repository';
import { Package } from './schemas/package.schema';

@Injectable()
export class PackagesService {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    return this.packagesRepository.create(createPackageDto);
  }

  async findAll(): Promise<Package[]> {
    return this.packagesRepository.findAll();
  }

  async findOne(id: string): Promise<Package> {
    return this.packagesRepository.findById(id);
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    return this.packagesRepository.update(id, updatePackageDto);
  }

  async remove(id: string): Promise<void> {
    return this.packagesRepository.remove(id);
  }

  // Check if a service is being used in any package
  async isServiceInUse(serviceId: string): Promise<boolean> {
    return this.packagesRepository.isServiceInUse(serviceId);
  }
}
