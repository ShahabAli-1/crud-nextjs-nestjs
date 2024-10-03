import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { ServicesService } from './services.service';
  import { CreateServiceDto } from './dto/create-service.dto';
  import { UpdateServiceDto } from './dto/update-service.dto';
  import { Service } from './service.model';
  
  @Controller('services')
  export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}
  
    @Post()
    async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
      return this.servicesService.create(createServiceDto);
    }
  
    @Get()
    async findAll(): Promise<Service[]> {
      return this.servicesService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Service> {
      return this.servicesService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateServiceDto: UpdateServiceDto,
    ): Promise<Service> {
      return this.servicesService.update(id, updateServiceDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return this.servicesService.remove(id);
    }
  }
  