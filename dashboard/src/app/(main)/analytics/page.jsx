"use client"

import { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign,
  Calendar,
  Home,
  TrendingUp,
  Star,
  BarChart2,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(""); // "" for all-time

  const fetchAnalyticsData = async (selectedPeriod) => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:3001/api/dashboard/analytics");
      if (selectedPeriod) {
        url.searchParams.append("period", selectedPeriod);
      }
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data);
        console.log(data)
      } else {
        throw new Error("Data fetch unsuccessful");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(period);
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">Loading Analytics...</div>
      </div>
    );
  }

  const { overview, performanceAnalytics, trendingAnalytics, averages, charts, filter } = analyticsData;

  // Helper to format numbers
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(0);
  };

  const formatCurrency = (num) => `$${formatNumber(num)}`;

  const formatPercentage = (num) => `${num.toFixed(2)}%`;

  // Growth indicator
  const GrowthIndicator = ({ value }) => {
    if (value > 0) {
      return <span className="text-green-500 flex items-center"><ArrowUp size={16} /> {formatPercentage(value)}</span>;
    } else if (value < 0) {
      return <span className="text-red-500 flex items-center"><ArrowDown size={16} /> {formatPercentage(Math.abs(value))}</span>;
    }
    return <span className="text-gray-500">0%</span>;
  };

  // Chart options base
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 }, color: "#333" },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.8)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
  };

  // Colors
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  // Listing Status Pie
  const listingStatusData = {
    labels: charts.listingStatusDistribution.map((item) => item._id),
    datasets: [{
      data: charts.listingStatusDistribution.map((item) => item.count),
      backgroundColor: colors,
    }],
  };

  // Meeting Status Doughnut
  const meetingStatusData = {
    labels: charts.meetingStatusOverview.map((item) => item._id),
    datasets: [{
      data: charts.meetingStatusOverview.map((item) => item.count),
      backgroundColor: colors.slice(0, charts.meetingStatusOverview.length),
    }],
  };

  // Price Range Bar
  const priceRangeData = {
    labels: charts.priceRangeDistribution.map((item) => item.range),
    datasets: [{
      label: "Listings",
      data: charts.priceRangeDistribution.map((item) => item.count),
      backgroundColor: "#3b82f6",
    }],
  };

  // Property Type Pie
  const propertyTypeData = {
    labels: charts.propertyTypeDistribution.map((item) => item._id),
    datasets: [{
      data: charts.propertyTypeDistribution.map((item) => item.count),
      backgroundColor: colors,
    }],
  };

  // Revenue Trend Line (assuming monthly, but data has only one; expand if more)
  const revenueTrendLabels = charts.revenueTrend.map((item) => `Month ${item._id}`);
  const revenueTrendData = {
    labels: revenueTrendLabels,
    datasets: [
      {
        label: "Revenue",
        data: charts.revenueTrend.map((item) => item.revenue),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
      },
      {
        label: "Transactions",
        data: charts.revenueTrend.map((item) => item.transactions),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
      },
    ],
  };

  // Popular Amenities Bar
  const popularAmenitiesData = {
    labels: trendingAnalytics.popularAmenities.map((item) => item._id),
    datasets: [{
      label: "Count",
      data: trendingAnalytics.popularAmenities.map((item) => item.count),
      backgroundColor: "#f59e0b",
    }],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="mr-2" /> Analytics Dashboard
        </h1>
        <FormControl variant="outlined" size="small" className="w-48">
          <InputLabel id="period-select-label">Time Period</InputLabel>
          <Select
            labelId="period-select-label"
            value={period}
            onChange={handlePeriodChange}
            label="Time Period"
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </header>

      {/* Overview Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Platform Overview ({filter})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Home className="text-blue-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Total Listings</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(overview.totalListings)}</p>
            <GrowthIndicator value={overview.platformGrowth.listingGrowth} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Calendar className="text-green-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Total Meetings</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(overview.totalMeetings)}</p>
            <GrowthIndicator value={overview.platformGrowth.meetingGrowth} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <DollarSign className="text-yellow-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(overview.totalRevenue)}</p>
            <GrowthIndicator value={overview.platformGrowth.revenueGrowth} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Users className="text-purple-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Total Users</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(overview.totalUsers)}</p>
            <GrowthIndicator value={overview.platformGrowth.userGrowth} />
          </div>
        </div>
      </section>

      {/* Averages Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Averages & Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <DollarSign className="text-blue-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Average Price</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(averages.avgPrice)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Activity className="text-green-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Avg Views/Listing</h3>
            </div>
            <p className="text-3xl font-bold">{formatNumber(averages.avgViewsPerListing)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <AlertCircle className="text-red-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Cancellation Rate</h3>
            </div>
            <p className="text-3xl font-bold">{formatPercentage(averages.meetingCancellationRate)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <CheckCircle className="text-purple-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Completion Rate</h3>
            </div>
            <p className="text-3xl font-bold">{formatPercentage(averages.meetingCompletionRate)}</p>
          </div>
        </div>
      </section>

      {/* Performance Analytics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <TrendingUp className="text-blue-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Listing Conversion</h3>
            </div>
            <p className="text-3xl font-bold">{formatPercentage(performanceAnalytics.listingConversionRate)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <TrendingUp className="text-green-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">Meeting Conversion</h3>
            </div>
            <p className="text-3xl font-bold">{formatPercentage(performanceAnalytics.meetingConversionRate)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Users className="text-yellow-500 mr-2" size={24} />
              <h3 className="text-lg font-medium">User Engagement</h3>
            </div>
            <p className="text-3xl font-bold">{formatPercentage(performanceAnalytics.userEngagementRate)}</p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Distribution Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md h-[600px]">
            <h3 className="text-lg font-medium mb-4 flex items-center"><PieChart className="mr-2" /> Listing Status</h3>
            <Pie data={listingStatusData} options={chartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md  h-[600px]">
            <h3 className="text-lg font-medium mb-4 flex items-center"><PieChart className="mr-2" /> Meeting Status</h3>
            <Doughnut data={meetingStatusData} options={chartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md  h-[600px]">
            <h3 className="text-lg font-medium mb-4 flex items-center"><BarChart2 className="mr-2" /> Price Range</h3>
            <Bar data={priceRangeData} options={chartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md  h-[600px]">
            <h3 className="text-lg font-medium mb-4 flex items-center"><PieChart className="mr-2" /> Property Types</h3>
            <Pie data={propertyTypeData} options={chartOptions} />
          </div>
        </div>
      </section>

      {/* Revenue Trend */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Revenue & Transactions Trend</h2>
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <Line data={revenueTrendData} options={chartOptions} />
        </div>
      </section>

      {/* Trending Analytics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Trending Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center"><Star className="mr-2" /> Popular Amenities</h3>
            <div className="h-80">
              <Bar data={popularAmenitiesData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center"><TrendingUp className="mr-2" /> Top Trending Listings</h3>
            <ul className="space-y-4">
              {trendingAnalytics.trendingListings.map((listing) => (
                <li key={listing._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-gray-500">{listing.location.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Views: {listing.views}</p>
                    <p className="text-sm">Favorites: {listing.favoritesCount}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;