import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ProductModule } from './modules/product/product.module';
import { WarehouseController } from './modules/warehouse/warehouse.controller';
import { ProductController } from './modules/product/product.controller';
import { WarehouseService } from './modules/warehouse/warehouse.service';
import { ProductService } from './modules/product/product.service';
import { Shelf } from './modules/warehouse/entities/shelf.entity';
import { WarehouseLog } from './modules/warehouse/entities/log.entity';
import { Section } from './modules/warehouse/entities/section.entity';
import { ProductLocation } from './modules/product/entities/product-location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shelf, Section, WarehouseLog, ProductLocation]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get('TYPEORM_SYNC') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    WarehouseModule,
    ProductModule,
  ],
  controllers: [WarehouseController, ProductController],
  providers: [WarehouseService, ProductService],
})
export class AppModule {}
