const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDb = require("./utils/DataBase");

// Load environment variables once here
dotenv.config({ path: "./utils/config.env" });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security headers
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Logging for dev
}

// CORS setup
const allowedOrigins = [
  "http://localhost:3000", // SellerCenter
  "http://localhost:3002", // Frontend
];

const corsOpt = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOpt));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

const listing = require("./Routes/ListingRoute")
app.use("/api/listings", listing);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server only after DB connects
(async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Exiting due to DB connection failure");
    process.exit(1);
  }
})();
