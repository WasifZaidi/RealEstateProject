const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDb = require("./utils/DataBase");
const ScheduledCleanupService = require('./services/scheduledCleanup');
// Load environment variables once here
dotenv.config({ path: "./utils/config.env" });

const app = express();

// CORS setup - MUST BE BEFORE OTHER MIDDLEWARE
const allowedOrigins = [
  "http://localhost:3000", // Dashboard
  "http://localhost:3002", // Frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS globally - REMOVE the separate app.options line
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(helmet()); // Security headers

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Logging for dev
}

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
const listing = require("./Routes/ListingRoute");
app.use("/api/listings", listing);
const userRoutes = require("./Routes/UserRoute")
app.use('/api', userRoutes )
const wishlistRoutes = require("./Routes/WishlistRoute")
app.use('/api', wishlistRoutes)
const meetingRoutes = require("./Routes/MettingRoute")
app.use('/api/meeting', meetingRoutes)
// Dashboard Routes
const accessorRoutes = require("./Routes/Dashboard/accessorRoute")
app.use("/api/dashboard", accessorRoutes );
// Agent Profile Routes
const agentRoute = require("./Routes/Dashboard/agentRoute");
app.use("/api/dashboard", agentRoute);

const agentFrontendRoutes =  require("./Routes/AgentRoute");
app.use("/api", agentFrontendRoutes);


// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  // CORS error handling
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: "CORS policy: Origin not allowed"
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Services
if (process.env.NODE_ENV === 'production') {
  ScheduledCleanupService.start();
}

// Start server only after DB connects
(async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📍 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error("❌ Exiting due to DB connection failure");
    process.exit(1);
  }
})();