import mongoose from 'mongoose';
import { menuItems } from './menu';
import MenuItem from '../models/MenuItem';
import config from '../config/config';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || config.mongoUri);
  console.log('Connected to DB for seeding menu');
  for (const m of menuItems) {
    const exists = await MenuItem.findOne({ name: m.name }).exec();
    if (exists) continue;
    const doc = new MenuItem({
      name: m.name,
      description: m.description,
      price: m.price,
      category: m.category,
      isVegetarian: m.isVegetarian,
      imageId: undefined,
    });
    await doc.save();
    console.log('Seeded:', m.name);
  }
  await mongoose.disconnect();
  console.log('Seeding complete');
}

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
