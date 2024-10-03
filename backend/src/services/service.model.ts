import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Package } from 'src/packages/schemas/package.schema';
export type ServiceDocument = Service & Document;

@Schema()
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.pre<ServiceDocument>(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const PackageModel = this.model('Package');

    try {
      // Remove this service from all packages
      await PackageModel.updateMany(
        { 'services.service': this._id },
        { $pull: { services: { service: this._id } } },
      );
      next();
    } catch (error) {
      next(error);
    }
  },
);
