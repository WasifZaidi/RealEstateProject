// seedDemoMeetings.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Meeting = require("./Model/Meeting");
const Listing = require("./Model/Listing");

const MONGO_URI =
  "mongodb+srv://wasifzaidi098_db_user:fQyzJvbX9LQ3tc4z@cluster0.dlloj7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function seedMeetings(count = 150) {
  await Meeting.deleteMany({});
  const listings = await Listing.find().select("_id agentRef agentId listing_publicId");

  if (!listings.length) {
    console.log("❌ No listings found. Please run seedDemoListings.js first.");
    return mongoose.connection.close();
  }

  const meetings = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const randomListing = faker.helpers.arrayElement(listings);

    // Random date within past 12 months
    const randomDaysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);

    const statuses = ["Scheduled", "Completed", "Cancelled"];
    const status = faker.helpers.arrayElement(statuses);

    const scheduledDate = faker.date.between({
      from: createdAt,
      to: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
    });

    const meeting = {
      meetingPublic_Id: `Meet-${faker.string.alphanumeric(8)}`,
      client: faker.database.mongodbObjectId(),
      agent: randomListing.agentRef,
      agentId: randomListing.agentId,
      listing: randomListing._id,
      listing_publicId: randomListing.listing_publicId || `L-${faker.string.alphanumeric(6)}`,
      date: scheduledDate,
      type: faker.helpers.arrayElement(["Tour", "Meeting"]),
      status,
      notes: faker.lorem.sentences(2),
      createdAt,
      updatedAt: createdAt,

      // ✅ Required: Created by (simulate agent or system)
      createdBy: randomListing.agentRef || faker.database.mongodbObjectId(),

      // ✅ Required: Location
      location: {
        state: faker.location.state(),
        city: faker.location.city(),
        coordinates: {
          type: "Point",
          coordinates: [
            parseFloat(faker.location.longitude()),
            parseFloat(faker.location.latitude()),
          ],
        },
        zipCode: faker.location.zipCode(),
        neighborhood: faker.location.streetAddress(),
      },

      // ✅ Required: Agent Contacts
      agentContacts: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
      },

      // ✅ Required: Client Contacts
      clientContacts: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
      },
    };

    meetings.push(meeting);
  }

  await Meeting.insertMany(meetings);
  console.log(`✅ Created ${count} demo meetings across different months and weeks`);
  mongoose.connection.close();
}

seedMeetings();
