// seedDemoListings.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Listing = require("./Model/Listing"); // adjust path

const MONGO_URI = "mongodb+srv://wasifzaidi098_db_user:fQyzJvbX9LQ3tc4z@cluster0.dlloj7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const categories = {
  Residential: ["apartment", "house", "villa", "condo", "townhouse"],
  Plot: ["commercial-plot", "residential-plot", "agricultural-plot", "industrial-plot"],
  Commercial: ["office", "retail", "warehouse", "restaurant"],
  Industrial: ["factory", "storage", "manufacturing"],
};

const amenitiesList = [
  "balcony", "garden", "fireplace", "pool", "modern-kitchen", "dishwasher", "microwave", "ac", "heating",
  "washer-dryer", "security-system", "gated-community", "cctv", "parking", "garage", "patio",
  "furnished", "pet-friendly", "wheelchair-accessible", "high-speed-internet", "smart-home"
];

const getRandomAmenities = () => {
  const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
  const count = faker.number.int({ min: 4, max: 8 });
  return shuffled.slice(0, count);
};

const getRandomCategory = () => {
  const categoryNames = Object.keys(categories);
  const category = faker.helpers.arrayElement(categoryNames);
  const subType = faker.helpers.arrayElement(categories[category]);
  return { category, subType };
};

async function seedListings(count = 200) {
  await Listing.deleteMany({});
  const listings = [];

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  for (let i = 0; i < count; i++) {
    const { category, subType } = getRandomCategory();

    // Spread createdAt evenly across last year
    const randomDaysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);

    const listing = {
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraphs(2),
      propertyType: { category, subType },
      propertyFor: faker.helpers.arrayElement(["Rent", "Sale"]),
      location: {
        state: faker.location.state(),
        city: faker.location.city(),
        coordinates: {
          type: "Point",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        zipCode: faker.location.zipCode(),
        neighborhood: faker.location.street(),
      },
      price: {
        amount: faker.number.int({ min: 20000, max: 2000000 }),
        currency: "USD",
        priceType: faker.helpers.arrayElement(["fixed", "negotiable"]),
        includesUtilities: faker.datatype.boolean(),
      },
      details: {
        size: faker.number.int({ min: 400, max: 5000 }),
        bedrooms: faker.number.int({ min: 1, max: 6 }),
        bathrooms: faker.number.int({ min: 1, max: 5 }),
        yearBuilt: faker.number.int({ min: 1990, max: 2024 }),
        floors: faker.number.int({ min: 1, max: 3 }),
        lotSize: faker.number.int({ min: 1000, max: 8000 }),
        parkingSpaces: faker.number.int({ min: 0, max: 4 }),
      },
      media: [
        {
          public_id: faker.string.uuid(),
          url: faker.image.urlLoremFlickr({ category: "house" }),
          resource_type: "image",
          format: "jpg",
          isCover: true,
          uploadOrder: 1,
        },
      ],
      amenities: getRandomAmenities(),
      status: faker.helpers.arrayElement(["active", "pending", "sold"]),
      isFeatured: faker.datatype.boolean(),
      isPremium: faker.datatype.boolean(),
      visibility: "public",
      owner: faker.person.fullName(),
      agentRef: "68f404e3893ffb2fe0d7f317", // adjust to real agent if needed
      agentId: "Agt-zTkvD5LzRX",
      contactInfo: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        showContact: true,
      },
      views: faker.number.int({ min: 0, max: 500 }),
      favoritesCount: faker.number.int({ min: 0, max: 50 }),
      createdAt, // ✅ KEY FIELD for analytics
      listedAt: createdAt,
      expiresAt: faker.date.future(),
    };

    listings.push(listing);
  }

  await Listing.insertMany(listings);
  console.log(`✅ Successfully created ${count} demo listings across different time ranges`);
  mongoose.connection.close();
}

seedListings(200);
