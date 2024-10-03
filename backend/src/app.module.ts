import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { ServicesModule } from './services/services.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Correct key name
     
      }),
      inject: [ConfigService],
    }),
    ServicesModule,
    PackagesModule,
    
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('Mongoose connected to MongoDB');
    });

    this.connection.on('error', (err) => {
      this.logger.error(`Mongoose connection error: ${err}`);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('Mongoose disconnected from MongoDB');
    });

    // Optional: Handle reconnection attempts
    this.connection.on('reconnected', () => {
      this.logger.log('Mongoose reconnected to MongoDB');
    });

    // Optional: Handle close event
    this.connection.on('close', () => {
      this.logger.warn('Mongoose connection closed');
    });
  }
}
