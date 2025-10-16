// seeder.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('./Model/User'); 

mongoose.connect('mongodb+srv://wasifzaidi098_db_user:fQyzJvbX9LQ3tc4z@cluster0.dlloj7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [];

    for (let i = 0; i < 30; i++) {
      const password = 'Password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const demoUser = {
        userName: faker.internet.username(), // ✅ works now
        Email: faker.internet.email().toLowerCase(),
        Password: hashedPassword,
        customId: faker.string.uuid(), // ✅ new API for uuid
        PhoneNumber: faker.phone.number('##########'),
        Birthday: {
          Month: faker.date.month(),
          Day: faker.number.int({ min: 1, max: 28 }),
          Year: faker.number.int({ min: 1970, max: 2005 }),
        },
        Gender: faker.person.sex(),
        ProfileImage: faker.image.avatar(),
        Address: [
          {
            defaultAddress: true,
            userName: faker.person.fullName(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            phoneCode: '+1',
            phoneNumber: faker.phone.number('##########'),
          },
        ],
        role: 'user',
        isVerified: faker.datatype.boolean(),
      };

      users.push(demoUser);
    }

    await User.insertMany(users);
    console.log('✅ 30 Demo Users Inserted Successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
