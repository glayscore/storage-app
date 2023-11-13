import { AppDataSource } from '../database/config';
import { Product } from '../modules/product/entities/product.entity';
import { Shelf } from '../modules/warehouse/entities/shelf.entity';
import { Section } from '../modules/warehouse/entities/section.entity';
import { ProductLocation } from '../modules/product/entities/product-location.entity';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedDatabase = async () => {
  await AppDataSource.initialize();
  const productRepository = AppDataSource.getRepository(Product);
  const shelfRepository = AppDataSource.getRepository(Shelf);
  const sectionRepository = AppDataSource.getRepository(Section);
  const productLocationRepository =
    AppDataSource.getRepository(ProductLocation);

  const shelves = [{ code: 'AA' }, { code: 'BA' }, { code: 'CA' }];

  const savedShelves = [];
  for (const shelf of shelves) {
    savedShelves.push(
      await shelfRepository.save(shelfRepository.create(shelf)),
    );
  }

  for (const shelf of savedShelves) {
    for (let i = 1; i <= 10; i++) {
      await sectionRepository.save(
        sectionRepository.create({ number: i, shelf }),
      );
    }
  }

  const products = [
    { name: 'Product 1', code: 'L12345 S', price: 10.99 },
    { name: 'Product 2', code: 'L12346 M', price: 15.99 },
    { name: 'Product 3', code: 'L12347 L', price: 20.99 },
  ];

  for (const product of products) {
    await productRepository.save(productRepository.create(product));
  }

  const allSections = await sectionRepository.find();

  const savedProducts = await productRepository.find();
  for (const product of savedProducts) {
    const randomSection = allSections[getRandomInt(0, allSections.length - 1)];
    const quantity = getRandomInt(1, 10);
    await productLocationRepository.save(
      productLocationRepository.create({
        product,
        section: randomSection,
        quantity,
      }),
    );
  }

  await AppDataSource.destroy();
};

seedDatabase()
  .then(() => console.log('Seeding complete!'))
  .catch((error) => console.error('Seeding failed', error));
