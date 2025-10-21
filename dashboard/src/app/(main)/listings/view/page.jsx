"use client";
import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import {
  Search,
  Home,
  Eye,
  Star,
  Settings,
  X,
  Edit,
  Trash2,
  Filter,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomToast from '@/app/components/CustomToast';

const ManageListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedListPublic_id, setSelectedListPublic_id] = useState(null);
  const [selectedList_id, setSelectedList_id] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0
  });

  // Fetch listings data
  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: '-createdAt',
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/agent?${params}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message);
      }

      const data = await response.json();

      if (data.success) {
        setListings(data.listings);
        console.log(data.listings)
        setTotalPages(data.totalPages);
        setTotalListings(data.totalListings);

        // Calculate stats (you might want to get this from a separate endpoint)
        calculateStats(data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (listingsData) => {
    const stats = {
      total: listingsData.length,
      active: listingsData.filter(listing => listing.status === 'active').length,
      pending: listingsData.filter(listing => listing.status === 'pending').length,
      sold: listingsData.filter(listing => listing.status === 'sold').length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchListings();
  }, [page, status]);

  const handleSearch = () => {
    setPage(1);
    fetchListings();
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus === status ? '' : newStatus);
    setPage(1);
  };

  // Open Confirm 
  const handelOpenConfirm = (public_id, id) => {
    setSelectedListPublic_id(public_id);
    setSelectedList_id(id)
    setConfirmOpen(true);
    setConfirmInput("");
  }

  const handelCloseConfirm = (id) => {
    setSelectedListPublic_id("")
    setConfirmOpen(false);
    setConfirmInput("");
  }

  const handelDelete = async (id) => {
    try {
      if (loading) return;
      setDeleteLoading(true);
      setSelectedList_id(id);

      if (!selectedListPublic_id) {
        setToast({ type: "error", message: `No meeting selected.` });
        return;
      }

      if (confirmInput.trim() !== selectedListPublic_id) {
        setToast({ type: "error", message: `Meeting ID confirmation does not match.` });
        return;
      }

      const response = await fetch(`http://localhost:3001/api/dashboard/listing/${selectedList_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete listing");
      }

      // ✅ Show success toast
      setToast({
        type: "success",
        message: data.message || "Listing deleted successfully.",
      });

      // Optionally refresh listings or remove deleted one from state
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error("Delete listing error:", error);
      setToast({
        type: "error",
        message: error.message || "An unexpected error occurred while deleting listing.",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmOpen(false);
      setConfirmInput("")
      setSelectedList_id(null);
    }
  };

  const getStatusChipColor = (status) => {
    const colors = {
      active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
      pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      sold: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
      draft: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-500' }
    };
    return colors[status] || colors.draft;
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const router = useRouter();
  const handelPushToEdit = (id) => {
    router.push(`/listings/update/${id}`)
  }
  return (
    <div className="min-h-screen rounded-[20px] bg-white px-4 sm:px-6 py-6 max-w-6xl w-[95%] mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            Manage Listings
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Manage your property listings and track performance</p>
        </div>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 justify-center"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleStatusFilter('active')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${status === 'active'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Active
        </button>
        <button
          onClick={() => handleStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${status === 'pending'
            ? 'bg-yellow-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilter('sold')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${status === 'sold'
            ? 'bg-green-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Sold
        </button>
        <button
          onClick={() => handleStatusFilter('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${status === ''
            ? 'bg-gray-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          All Status
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {search || status ? 'No listings match your search criteria. Try adjusting your filters.' : 'You have no property listings yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property Details
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((listing, index) => {
                    const statusColor = getStatusChipColor(listing.status);
                    return (
                      <tr
                        key={listing._id}
                        className="hover:bg-blue-50/30 transition-all duration-150 group border-b border-gray-100 last:border-b-0"
                      >
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                              {listing.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Listed {formatDate(listing.listedAt || listing.createdAt)}
                            </p>
                            {listing.isFeatured && (
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                <span className="text-xs text-yellow-700 font-medium">Featured</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(listing.price.amount, listing.price.currency)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-700 capitalize">
                            {listing.propertyType?.subType?.replace(/-/g, ' ') || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${statusColor.bg} ${statusColor.border} ${statusColor.text} transition-all duration-200 hover:scale-105 hover:shadow-sm`}>
                            <div className={`w-2 h-2 rounded-full ${statusColor.dot} animate-pulse`}></div>
                            <span className="text-xs font-semibold tracking-wide uppercase">
                              {listing.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            {listing.views || 0}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="inline-flex items-center cursor-pointer gap-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-[50px] text-sm font-semibold transition-all duration-200 group-hover:shadow-sm"
                              onClick={(e) => { handelPushToEdit(listing._id) }}
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => { handelOpenConfirm("LI-123456", listing._id) }}
                              className="inline-flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5  rounded-[50px] text-sm font-semibold transition-all duration-200 group-hover:shadow-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete */}

      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              To confirm, please type <strong>{selectedListPublic_id}</strong> below.
              This action is <span className="text-red-600 font-medium">irreversible</span>.
            </p>

            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Type "${selectedListPublic_id}" to confirm`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={handelCloseConfirm}
                className="px-4 py-2 rounded-[50px] cursor-pointer text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handelDelete}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-[50px] font-medium text-white transition-all ${confirmInput.trim() === selectedListPublic_id
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
                  }`}
                disabled={confirmInput.trim() !== selectedListPublic_id || deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {listings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalListings)} of {totalListings} listings
          </p>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            shape="rounded"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '10px',
                margin: '0 2px',
              },
              '& .Mui-selected': {
                backgroundColor: '#2563eb',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                }
              }
            }}
          />
        </div>
      )}
      {toast && <CustomToast {...toast} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default ManageListingsPage;