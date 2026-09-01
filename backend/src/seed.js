require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
    process.exit(0);
  }

  await User.create({
    name: 'Administrator',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  console.log(`Admin created: ${adminEmail}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});