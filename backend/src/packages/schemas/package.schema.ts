// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Service } from 'src/services/service.model';
// export type PackageDocument = Package & Document;

// @Schema()
// export class PackageService {
//   @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
//   service: Service;

//   @Prop({ required: true, min: 1 })
//   quantity: number;
// }

// export const PackageServiceSchema =
//   SchemaFactory.createForClass(PackageService);

// @Schema()
// export class Package {
//   @Prop({ required: true, unique: true })
//   name: string;

//   @Prop({ required: true })
//   description: string;

//   @Prop({ type: [PackageServiceSchema], required: true })
//   services: PackageService[];
// }

// export const PackageSchema = SchemaFactory.createForClass(Package);
// src/packages/schemas/package.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from 'src/services/service.model';

export type PackageDocument = Package & Document;

@Schema()
export class Package {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop([
    {
      service: { type: Types.ObjectId, ref: 'Service', required: true },
      quantity: { type: Number, default: 1, min: 1 },
    },
  ])
  services: { service: Types.ObjectId; quantity: number }[];
}

export const PackageSchema = SchemaFactory.createForClass(Package);
