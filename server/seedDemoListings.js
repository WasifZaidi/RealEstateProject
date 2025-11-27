// seedDemoListings.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Listing = require("./Model/Listing"); // adjust path

const MONGO_URI =
  "mongodb+srv://wasifzaidi098_db_user:fQyzJvbX9LQ3tc4z@cluster0.dlloj7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ==========================
// CONNECT TO MONGO
// ==========================
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==========================
// REAL UNSPLASH IMAGES
// ==========================
const realEstateImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11",
  "https://images.unsplash.com/photo-1600607689801-9e99d8838f6f",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
  "https://images.unsplash.com/photo-1613977257365-aaae5a9817df",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d6f0aa",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1600585153831-8030058a0f57",
  "https://images.unsplash.com/photo-1600585154081-8abf21b74df8",
  "https://images.unsplash.com/photo-1600047509795-5c2c2f53f661",
  "https://images.unsplash.com/photo-1600585154037-dc3f92d75d7b",
];

// ==========================
// REAL TITLES & DESCRIPTIONS
// ==========================
const realTitles = [
  "Modern 3-Bedroom Apartment in Downtown",
  "Luxury Villa With Private Swimming Pool",
  "Fully Furnished Family Home in Quiet Area",
  "Brand New Commercial Office Space Available",
  "Prime Residential Plot Inside Gated Society",
  "Penthouse With Beautiful City Skyline View",
  "Affordable 2-Bed Apartment Near Main Road",
  "Corner House With Large Green Garden",
  "Top-Floor High-Rise Condo With Balcony",
  "Warehouse Space Ideal for E-Commerce",
];

const realDescriptions = [
  "A beautifully designed apartment located in a prime downtown location. Features include a modern kitchen, spacious living room, and balcony with scenic views.",
  "A premium villa with luxurious interiors, a private pool, landscaped lawn, and high-end fittings. Perfect for families seeking comfort and privacy.",
  "A fully furnished home featuring 4 bedrooms, 3 bathrooms, a spacious backyard, and nearby access to markets and schools.",
  "This commercial office space is ideal for corporate teams. Equipped with fiber internet, parking, a reception area, and CCTV.",
  "A prime residential plot in a well-developed gated community. Safe, secure, and surrounded by modern infrastructure.",
  "This penthouse offers floor-to-ceiling windows, an open-plan kitchen, and panoramic views of the city skyline.",
];

// ==========================
// REAL CITIES (PAKISTAN)
// ==========================
const pkCities = [
  { city: "Karachi", state: "Sindh" },
  { city: "Lahore", state: "Punjab" },
  { city: "Islamabad", state: "Islamabad Capital Territory" },
  { city: "Rawalpindi", state: "Punjab" },
  { city: "Faisalabad", state: "Punjab" },
  { city: "Multan", state: "Punjab" },
  { city: "Peshawar", state: "Khyber Pakhtunkhwa" },
  { city: "Quetta", state: "Balochistan" },
];

// ==========================
// CATEGORIES
// ==========================
const categories = {
  Residential: ["apartment", "house", "villa", "condo", "townhouse"],
  Plot: ["commercial-plot", "residential-plot", "agricultural-plot", "industrial-plot"],
  Commercial: ["office", "retail", "warehouse", "restaurant"],
  Industrial: ["factory", "storage", "manufacturing"],
};

// ==========================
// AMENITIES
// ==========================
const amenitiesList = [
  "balcony", "garden", "fireplace", "pool", "modern-kitchen", "dishwasher",
  "microwave", "ac", "heating", "washer-dryer", "security-system", "gated-community",
  "cctv", "parking", "garage", "patio", "furnished", "pet-friendly",
  "wheelchair-accessible", "high-speed-internet", "smart-home"
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

// ==========================
// SEED FUNCTION
// ==========================
async function seedListings(count = 100) {
  await Listing.deleteMany({});
  const listings = [];

  const now = new Date();

  for (let i = 0; i < count; i++) {
    const { category, subType } = getRandomCategory();
    const selectedCity = faker.helpers.arrayElement(pkCities);

    // Distribute createdAt over the last year
    const randomDaysAgo = faker.number.int({ min: 1, max: 365 });
    const createdAt = new Date();
    createdAt.setDate(now.getDate() - randomDaysAgo);

    const isPlot = category === "Plot";

    const listing = {
      title: faker.helpers.arrayElement(realTitles),
      description: faker.helpers.arrayElement(realDescriptions),

      propertyType: { category, subType },
      propertyFor: faker.helpers.arrayElement(["Rent", "Sale"]),

      location: {
        state: selectedCity.state,
        city: selectedCity.city,
        coordinates: {
          type: "Point",
          coordinates: [
            Number(faker.location.longitude()),
            Number(faker.location.latitude())
          ]
        },
        zipCode: faker.location.zipCode(),
        neighborhood: faker.location.streetAddress(),
      },

      price: {
        amount: faker.number.int({
          min: isPlot ? 800000 : 10000,
          max: isPlot ? 30000000 : 10000000,
        }),
        currency: "PKR",
        priceType: faker.helpers.arrayElement(["fixed", "negotiable"]),
        includesUtilities: faker.datatype.boolean(),
      },

      details: {
        size: faker.number.int({ min: 300, max: 7000 }),
        bedrooms: isPlot ? 0 : faker.number.int({ min: 1, max: 6 }),
        bathrooms: isPlot ? 0 : faker.number.int({ min: 1, max: 5 }),
        yearBuilt: isPlot ? null : faker.number.int({ min: 1990, max: 2024 }),
        floors: isPlot ? 0 : faker.number.int({ min: 1, max: 3 }),
        lotSize: faker.number.int({ min: 800, max: 9000 }),
        parkingSpaces: faker.number.int({ min: 0, max: 4 }),
      },

      media: [
        {
          public_id: faker.string.uuid(),
          url: faker.helpers.arrayElement(realEstateImages),
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
      agentRef: "68f404e3893ffb2fe0d7f317",
      agentId: "Agt-zTkvD5LzRX",

      contactInfo: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        showContact: true,
      },

      views: faker.number.int({ min: 0, max: 500 }),
      favoritesCount: faker.number.int({ min: 0, max: 50 }),

      createdAt,
      listedAt: createdAt,
      expiresAt: faker.date.future(),
    };

    listings.push(listing);
  }

  await Listing.insertMany(listings);
  console.log(`✅ Successfully created ${count} REALISTIC demo listings`);
  mongoose.connection.close();
}

seedListings(100);
