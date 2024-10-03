import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Package, PackageDocument } from '../schemas/package.schema';
import { CreatePackageDto } from '../dto/create-package.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { ServicesRepository } from 'src/services/service.repository';
import { Service } from 'src/services/service.model';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class PackagesRepository {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    @Inject(forwardRef(() => ServicesRepository))
    private readonly servicesRepository: ServicesRepository,
  ) {}

  // Updated return type to PackageDocument | null
  async findByName(name: string): Promise<PackageDocument | null> {
    return this.packageModel.findOne({ name }).exec();
  }

  async create(createPackageDto: CreatePackageDto): Promise<PackageDocument> {
    // Validate that all service IDs exist
    for (const item of createPackageDto.services) {
      await this.servicesRepository.findById(item.service);
    }

    // Check for duplicate package name
    const existingPackage = await this.findByName(createPackageDto.name);
    if (existingPackage) {
      throw new BadRequestException(
        `Package with name "${createPackageDto.name}" already exists.`,
      );
    }

    // Check for duplicate service IDs within the package
    const serviceIds = createPackageDto.services.map((s) => s.service);
    const uniqueServiceIds = new Set(serviceIds);
    if (uniqueServiceIds.size !== serviceIds.length) {
      throw new BadRequestException(
        'A service cannot be added multiple times to a package.',
      );
    }

    const createdPackage = new this.packageModel(createPackageDto);
    return createdPackage.save();
  }

  async findAll(): Promise<PackageDocument[]> {
    return this.packageModel.find().populate('services.service').exec();
  }

  async findById(id: string): Promise<PackageDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const packageObj = await this.packageModel
      .findById(id)
      .populate('services.service')
      .exec();
    if (!packageObj) {
      throw new BadRequestException(`Package with ID ${id} not found`);
    }
    return packageObj;
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDocument> {
    if (updatePackageDto.name) {
      // Check for duplicate package name
      const existingPackage = await this.findByName(updatePackageDto.name);
      if (existingPackage && existingPackage._id.toString() !== id) {
        throw new BadRequestException(
          `Package with name "${updatePackageDto.name}" already exists.`,
        );
      }
    }

    if (updatePackageDto.services) {
      // Check for duplicate service IDs within the package
      const serviceIds = updatePackageDto.services.map((s) => s.service);
      const uniqueServiceIds = new Set(serviceIds);
      if (uniqueServiceIds.size !== serviceIds.length) {
        throw new BadRequestException(
          'A service cannot be added multiple times to a package.',
        );
      }

      // Validate that all service IDs exist
      for (const item of updatePackageDto.services) {
        await this.servicesRepository.findById(item.service);
      }
    }

    const updatedPackage = await this.packageModel
      .findByIdAndUpdate(id, updatePackageDto, { new: true })
      .populate('services.service')
      .exec();
    if (!updatedPackage) {
      throw new BadRequestException(`Package with ID ${id} not found`);
    }
    return updatedPackage;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const result = await this.packageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException(`Package with ID ${id} not found`);
    }
  }

  // Check if the service is part of any package
  async isServiceInUse(serviceId: string): Promise<boolean> {
    const count = await this.packageModel.countDocuments({
      'services.service': serviceId,
    });
    return count > 0;
  }
}
