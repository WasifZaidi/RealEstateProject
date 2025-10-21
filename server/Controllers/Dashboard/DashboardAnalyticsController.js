const mongoose = require("mongoose");
const Listing = require("../../Model/Listing");
const Meeting = require("../../Model/Meeting");
const Wishlist = require("../../Model/Wishlists");
const User = require("../../Model/User");
const Agent = require("../../Model/Agent");

// Helper: calculate growth %
const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

// Helper: get start date for time filter
const getTimeRange = (period) => {
  const now = new Date();
  let start = new Date();

  switch (period) {
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start = new Date(0); // no filter
  }
  return { start, end: now };
};

// ========================= //
// 📊 GET ROLE-BASED ANALYTICS
// ========================= //
exports.getAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { role } = user; // 'admin' | 'manager' | 'agent'
    const { period } = req.query; // 'week' | 'month' | 'year'
    const { start, end } = getTimeRange(period);

    let matchQuery = { createdAt: { $gte: start, $lte: end } };
    let agent;

    if (role === "agent") {
      agent = await Agent.findOne({ user: req.user.id });
      if (!agent) return res.status(404).json({ success: false, message: "Agent not found" });
      matchQuery.agentRef = agent._id;
    }

    // ===== 1. Current Period Counts =====
    const [totalListings, totalUsers, totalMeetings] = await Promise.all([
      Listing.countDocuments(matchQuery),
      role === "agent"
        ? User.countDocuments({ _id: req.user.id })
        : User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Meeting.countDocuments(
        role === "agent"
          ? { agentId: agent?.agentId, createdAt: { $gte: start, $lte: end } }
          : { createdAt: { $gte: start, $lte: end } }
      ),
    ]);

    // ===== 2. Total Revenue =====
    const totalRevenueAgg = await Listing.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: "$price.amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // ===== 3. Previous Period for Growth =====
    const prevRange = (() => {
      const prevEnd = new Date(start);
      const prevStart = new Date(prevEnd);
      if (period === "week") prevStart.setDate(prevEnd.getDate() - 7);
      else if (period === "month") prevStart.setMonth(prevEnd.getMonth() - 1);
      else if (period === "year") prevStart.setFullYear(prevEnd.getFullYear() - 1);
      else prevStart.setFullYear(prevEnd.getFullYear() - 1);
      return { start: prevStart, end: prevEnd };
    })();

    const [prevListings, prevUsers, prevMeetings, prevRevenueAgg] = await Promise.all([
      Listing.countDocuments({ createdAt: { $gte: prevRange.start, $lt: prevRange.end } }),
      role === "agent"
        ? User.countDocuments({ _id: req.user.id, createdAt: { $gte: prevRange.start, $lt: prevRange.end } })
        : User.countDocuments({ createdAt: { $gte: prevRange.start, $lt: prevRange.end } }),
      Meeting.countDocuments({ createdAt: { $gte: prevRange.start, $lt: prevRange.end } }),
      Listing.aggregate([
        { $match: { createdAt: { $gte: prevRange.start, $lt: prevRange.end } } },
        { $group: { _id: null, total: { $sum: "$price.amount" } } },
      ]),
    ]);
    const prevRevenue = prevRevenueAgg[0]?.total || 0;

    const platformGrowth = {
      listingGrowth: calculateGrowth(totalListings, prevListings),
      userGrowth: calculateGrowth(totalUsers, prevUsers),
      meetingGrowth: calculateGrowth(totalMeetings, prevMeetings),
      revenueGrowth: calculateGrowth(totalRevenue, prevRevenue),
    };

    // ===== 4. Performance Analytics =====
    const totalWishlistItems = await Wishlist.aggregate([
      { $unwind: "$listings" },
      {
        $lookup: {
          from: "listings",
          localField: "listings.listing",
          foreignField: "_id",
          as: "listingData",
        },
      },
      { $unwind: "$listingData" },
      { $match: { "listingData.createdAt": { $gte: start, $lte: end } } },
      { $count: "count" },
    ]);
    const wishCount = totalWishlistItems[0]?.count || 0;

    const listingConversionRate = totalListings ? (wishCount / totalListings) * 100 : 0;
    const meetingConversionRate = totalMeetings ? (totalMeetings / totalListings) * 100 : 0;
    const userEngagementRate = totalUsers ? ((wishCount + totalMeetings) / totalUsers) * 100 : 0;

    const performanceAnalytics = {
      listingConversionRate,
      meetingConversionRate,
      userEngagementRate,
    };

    // ===== 5. Trending Analytics =====
    const popularAmenities = await Listing.aggregate([
      { $match: matchQuery },
      { $unwind: "$amenities" },
      { $group: { _id: "$amenities", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const trendingListings = await Listing.find(matchQuery)
      .sort({ views: -1, favoritesCount: -1 })
      .limit(10)
      .select("title views favoritesCount price.propertyType location.city");

    // ===== 6. Chart Distributions =====
    const [
      propertyTypeDistribution,
      listingStatusDistribution,
      meetingStatusOverview,
      revenueTrendRaw,
    ] = await Promise.all([
      Listing.aggregate([{ $match: matchQuery }, { $group: { _id: "$propertyType.category", count: { $sum: 1 } } }]),
      Listing.aggregate([{ $match: matchQuery }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Meeting.aggregate([{ $match: matchQuery }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      // ✅ Month-Based Revenue Trend for Last 12 Months
      Listing.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
          },
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: "$price.amount" },
            transactions: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    // Convert to readable chart format
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueTrend = revenueTrendRaw.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      transactions: item.transactions,
    }));

    // ===== 7. Price Range Distribution =====
    const priceRanges = [
      { label: "0-100k", min: 0, max: 100000 },
      { label: "100k-500k", min: 100000, max: 500000 },
      { label: "500k-1M", min: 500000, max: 1000000 },
      { label: "1M+", min: 1000000, max: Infinity },
    ];
    const priceRangeDistribution = [];
    for (const range of priceRanges) {
      const count = await Listing.countDocuments({
        ...matchQuery,
        "price.amount": { $gte: range.min, $lt: range.max === Infinity ? 1e15 : range.max },
      });
      priceRangeDistribution.push({ range: range.label, count });
    }

    // ===== 8. Meeting Analytics =====
    const totalCompleted = meetingStatusOverview.find((m) => m._id === "Completed")?.count || 0;
    const totalCancelled = meetingStatusOverview.find((m) => m._id === "Cancelled")?.count || 0;
    const meetingCompletionRate = totalMeetings ? (totalCompleted / totalMeetings) * 100 : 0;
    const meetingCancellationRate = totalMeetings ? (totalCancelled / totalMeetings) * 100 : 0;

    // ===== 9. Averages =====
    const avgViews =
      (await Listing.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, avg: { $avg: "$views" } } },
      ]))[0]?.avg || 0;

    const avgPrice =
      (await Listing.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, avg: { $avg: "$price.amount" } } },
      ]))[0]?.avg || 0;

    // ===== Response =====
    res.status(200).json({
      success: true,
      filter: period || "all-time",
      overview: {
        totalListings,
        totalUsers,
        totalMeetings,
        totalRevenue,
        platformGrowth,
      },
      performanceAnalytics,
      trendingAnalytics: {
        popularAmenities,
        trendingListings,
      },
      charts: {
        propertyTypeDistribution,
        listingStatusDistribution,
        priceRangeDistribution,
        meetingStatusOverview,
        revenueTrend,
      },
      averages: {
        avgViewsPerListing: avgViews,
        avgPrice,
        meetingCompletionRate,
        meetingCancellationRate,
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
