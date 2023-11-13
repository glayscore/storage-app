import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { ProductLocation } from '../product/entities/product-location.entity';
import { Section } from './entities/section.entity';
import { Shelf } from './entities/shelf.entity';
import { WarehouseLog } from './entities/log.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductLocation,
      Section,
      Shelf,
      WarehouseLog,
      Product,
    ]),
    ProductModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
