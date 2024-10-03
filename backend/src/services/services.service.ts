import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesRepository } from './service.repository';
import { Service } from './service.model';
import { PackagesService } from 'src/packages/packages.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
    @Inject(forwardRef(() => PackagesService)) // Use forwardRef for circular dependency
    private readonly packagesService: PackagesService,
  ) {}

  // async create(createServiceDto: CreateServiceDto): Promise<Service> {
  //   return this.servicesRepository.create(createServiceDto);
  // }
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Check if a service with the same name already exists
    const existingService = await this.servicesRepository.findByName(
      createServiceDto.name,
    );
    if (existingService) {
      throw new BadRequestException(
        `Service with name "${createServiceDto.name}" already exists.`,
      );
    }

    // Create the service if it doesn't exist
    return this.servicesRepository.create(createServiceDto);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.findAll();
  }

  async findOne(id: string): Promise<Service> {
    return this.servicesRepository.findById(id);
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesRepository.update(id, updateServiceDto);
  }

  async remove(id: string): Promise<void> {
    const isInUse = await this.packagesService.isServiceInUse(id);
    if (isInUse) {
      throw new BadRequestException(
        'Service cannot be deleted because it is part of a package.',
      );
    }
    return this.servicesRepository.remove(id);
  }
}
