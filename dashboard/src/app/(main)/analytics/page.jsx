"use client"

import { useEffect, useState, useCallback, useMemo } from "react";
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
  RefreshCw,
} from "lucide-react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Register ChartJS components
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
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("");

  // Memoized fetch function to prevent unnecessary recreations
  const fetchAnalyticsData = useCallback(async (selectedPeriod) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL("http://localhost:3001/api/dashboard/analytics");
      if (selectedPeriod) {
        url.searchParams.append("period", selectedPeriod);
      }
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data);
      } else {
        throw new Error("Data fetch unsuccessful");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial load and period changes
  useEffect(() => {
    fetchAnalyticsData(period);
  }, [period, fetchAnalyticsData]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchAnalyticsData(period);
  }, [fetchAnalyticsData, period]);

  const handlePeriodChange = useCallback((event) => {
    setPeriod(event.target.value);
  }, []);

  // Memoized formatting functions
  const formatNumber = useCallback((num) => {
    if (!num && num !== 0) return "0";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(0);
  }, []);

  const formatCurrency = useCallback((num) => `$${formatNumber(num)}`, [formatNumber]);

  const formatPercentage = useCallback((num) => `${num?.toFixed(2) || "0.00"}%`, []);

  // Growth Indicator Component
  const GrowthIndicator = useCallback(({ value }) => {
    const numericValue = parseFloat(value) || 0;
    if (numericValue > 0) {
      return (
        <span className="text-green-500 flex items-center text-sm font-medium">
          <ArrowUp size={16} className="mr-1" /> 
          {formatPercentage(numericValue)}
        </span>
      );
    } else if (numericValue < 0) {
      return (
        <span className="text-red-500 flex items-center text-sm font-medium">
          <ArrowDown size={16} className="mr-1" /> 
          {formatPercentage(Math.abs(numericValue))}
        </span>
      );
    }
    return <span className="text-gray-500 text-sm font-medium">0%</span>;
  }, [formatPercentage]);

  // Base chart options with memoization - FIXED FOR PIE CHARTS
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { 
          font: { 
            size: 12,
            family: "'Inter', 'SF Pro Display', -apple-system, sans-serif" 
          }, 
          color: "#374151",
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        titleFont: {
          size: 12,
          weight: '600',
        },
        bodyFont: {
          size: 11,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
    },
  }), []);

  // SPECIAL OPTIONS FOR PIE/DOUGHNUT CHARTS - REMOVES GRID LINES
  const pieChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { 
          font: { 
            size: 12,
            family: "'Inter', 'SF Pro Display', -apple-system, sans-serif" 
          }, 
          color: "#374151",
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        titleFont: {
          size: 12,
          weight: '600',
        },
        bodyFont: {
          size: 11,
        },
      },
    },
    // CRITICAL FIX: Remove scales completely for pie/doughnut charts
    scales: {},
  }), []);

  // Revenue trends chart options
  const chartOptionsRevenueTrends = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { 
            size: 12,
            family: "'Inter', 'SF Pro Display', -apple-system, sans-serif"
          },
          color: "#374151",
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        ticks: { 
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
        grid: { 
          display: false,
        },
      },
      yRevenue: {
        type: "linear",
        display: true,
        position: "left",
        title: { 
          display: true, 
          text: "Revenue (PKR)", 
          color: "#10b981",
          font: {
            size: 11,
            weight: '600',
          },
        },
        ticks: {
          color: "#10b981",
          callback: (value) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(value),
          font: {
            size: 11,
          },
        },
        grid: { 
          color: "#F3F4F6",
        },
      },
      yTransactions: {
        type: "linear",
        display: true,
        position: "right",
        title: { 
          display: true, 
          text: "Transactions", 
          color: "#3b82f6",
          font: {
            size: 11,
            weight: '600',
          },
        },
        ticks: { 
          color: "#3b82f6",
          font: {
            size: 11,
          },
        },
        grid: { 
          drawOnChartArea: false,
        },
      },
    },
  }), []);

  // Chart data preparation with safe fallbacks
  const chartData = useMemo(() => {
    if (!analyticsData) return null;

    const { charts, trendingAnalytics } = analyticsData;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

    return {
      listingStatus: {
        labels: charts?.listingStatusDistribution?.map((item) => item?._id || "Unknown") || [],
        datasets: [{
          data: charts?.listingStatusDistribution?.map((item) => item?.count || 0) || [],
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 15, // Added hover effect
        }],
      },
      meetingStatus: {
        labels: charts?.meetingStatusOverview?.map((item) => item?._id || "Unknown") || [],
        datasets: [{
          data: charts?.meetingStatusOverview?.map((item) => item?.count || 0) || [],
          backgroundColor: colors.slice(0, charts?.meetingStatusOverview?.length || 0),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 15, // Added hover effect
          cutout: '60%', // For doughnut chart
        }],
      },
      priceRange: {
        labels: charts?.priceRangeDistribution?.map((item) => item?.range || "Unknown") || [],
        datasets: [{
          label: "Listings",
          data: charts?.priceRangeDistribution?.map((item) => item?.count || 0) || [],
          backgroundColor: "#3b82f6",
          borderRadius: 4,
        }],
      },
      propertyType: {
        labels: charts?.propertyTypeDistribution?.map((item) => item?._id || "Unknown") || [],
        datasets: [{
          data: charts?.propertyTypeDistribution?.map((item) => item?.count || 0) || [],
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 15, // Added hover effect
        }],
      },
      revenueTrend: {
        labels: charts?.revenueTrend?.map((item) => item?.month || "Unknown") || [],
        datasets: [
          {
            label: "Revenue (PKR)",
            data: charts?.revenueTrend?.map((item) => item?.revenue || 0) || [],
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            yAxisID: "yRevenue",
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
          },
          {
            label: "Transactions",
            data: charts?.revenueTrend?.map((item) => item?.transactions || 0) || [],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            yAxisID: "yTransactions",
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
          },
        ],
      },
      popularAmenities: {
        labels: trendingAnalytics?.popularAmenities?.map((item) => item?._id || "Unknown") || [],
        datasets: [{
          label: "Count",
          data: trendingAnalytics?.popularAmenities?.map((item) => item?.count || 0) || [],
          backgroundColor: "#f59e0b",
          borderRadius: 4,
        }],
      },
    };
  }, [analyticsData]);

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-lg font-semibold text-gray-600">Loading Analytics...</div>
          <div className="text-sm text-gray-500 mt-2">Preparing your dashboard</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overview, performanceAnalytics, trendingAnalytics, averages, filter } = analyticsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-xl shadow-sm mr-3">
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Real-time platform performance insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <FormControl variant="outlined" size="small" className="w-40 bg-white rounded-lg">
            <InputLabel id="period-select-label" className="text-sm">Time Period</InputLabel>
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
        </div>
      </header>

      {/* Overview Cards */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Platform Overview</h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            {filter || "All Time"}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              icon: Home, 
              label: "Total Listings", 
              value: overview?.totalListings, 
              growth: overview?.platformGrowth?.listingGrowth,
              color: "blue" 
            },
            { 
              icon: Calendar, 
              label: "Total Meetings", 
              value: overview?.totalMeetings, 
              growth: overview?.platformGrowth?.meetingGrowth,
              color: "green" 
            },
            { 
              icon: DollarSign, 
              label: "Total Revenue", 
              value: overview?.totalRevenue, 
              growth: overview?.platformGrowth?.revenueGrowth,
              color: "yellow",
              format: formatCurrency 
            },
            { 
              icon: Users, 
              label: "Total Users", 
              value: overview?.totalUsers, 
              growth: overview?.platformGrowth?.userGrowth,
              color: "purple" 
            },
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${card.color}-50`}>
                  <card.icon className={`w-5 h-5 text-${card.color}-500`} />
                </div>
                <GrowthIndicator value={card.growth} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.label}</h3>
              <p className="text-2xl font-bold text-gray-800">
                {card.format ? card.format(card.value) : formatNumber(card.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Averages Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Averages & Rates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              icon: DollarSign, 
              label: "Average Price", 
              value: averages?.avgPrice, 
              color: "blue",
              format: formatCurrency 
            },
            { 
              icon: Activity, 
              label: "Avg Views/Listing", 
              value: averages?.avgViewsPerListing, 
              color: "green" 
            },
            { 
              icon: AlertCircle, 
              label: "Cancellation Rate", 
              value: averages?.meetingCancellationRate, 
              color: "red",
              format: formatPercentage 
            },
            { 
              icon: CheckCircle, 
              label: "Completion Rate", 
              value: averages?.meetingCompletionRate, 
              color: "purple",
              format: formatPercentage 
            },
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg bg-${card.color}-50 mr-3`}>
                  <card.icon className={`w-5 h-5 text-${card.color}-500`} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{card.label}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {card.format ? card.format(card.value) : formatNumber(card.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Analytics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: TrendingUp, 
              label: "Listing Conversion", 
              value: performanceAnalytics?.listingConversionRate, 
              color: "blue",
              format: formatPercentage 
            },
            { 
              icon: TrendingUp, 
              label: "Meeting Conversion", 
              value: performanceAnalytics?.meetingConversionRate, 
              color: "green",
              format: formatPercentage 
            },
            { 
              icon: Users, 
              label: "User Engagement", 
              value: performanceAnalytics?.userEngagementRate, 
              color: "yellow",
              format: formatPercentage 
            },
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg bg-${card.color}-50 mr-3`}>
                  <card.icon className={`w-5 h-5 text-${card.color}-500`} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{card.label}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {card.format ? card.format(card.value) : formatNumber(card.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section - FIXED PIE CHARTS */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Distribution Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listing Status Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <PieChart className="w-5 h-5 mr-2 text-blue-500" />
              Listing Status
            </h3>
            <div className="h-80">
              <Pie data={chartData?.listingStatus} options={pieChartOptions} />
            </div>
          </div>

          {/* Meeting Status Doughnut Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <PieChart className="w-5 h-5 mr-2 text-green-500" />
              Meeting Status
            </h3>
            <div className="h-80">
              <Doughnut data={chartData?.meetingStatus} options={pieChartOptions} />
            </div>
          </div>

          {/* Price Range Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
              Price Range
            </h3>
            <div className="h-80">
              <Bar data={chartData?.priceRange} options={chartOptions} />
            </div>
          </div>

          {/* Property Types Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <PieChart className="w-5 h-5 mr-2 text-orange-500" />
              Property Types
            </h3>
            <div className="h-80">
              <Pie data={chartData?.propertyType} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Trend */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Revenue & Transactions Trend</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-96">
            <Line data={chartData?.revenueTrend} options={chartOptionsRevenueTrends} />
          </div>
        </div>
      </section>

      {/* Trending Analytics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Trending Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Popular Amenities
            </h3>
            <div className="h-80">
              <Bar data={chartData?.popularAmenities} options={chartOptions} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Top Trending Listings
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {trendingAnalytics?.trendingListings?.map((listing, index) => (
                <div key={listing?._id || index} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{listing?.title || "Unknown Listing"}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {listing?.location?.city || "Unknown Location"}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-800 text-sm">Views: {listing?.views || 0}</p>
                    <p className="text-sm text-gray-500">Favorites: {listing?.favoritesCount || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;