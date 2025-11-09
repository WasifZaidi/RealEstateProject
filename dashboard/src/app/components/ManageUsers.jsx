"use client";
import React, { useEffect, useState } from "react";
import {
    Pagination,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    Button,
    Chip,
    IconButton,
} from "@mui/material";
import { Settings, Trash2, ShieldCheck, X, User, Search, Shield, UserCheck, UserCog, Info, Save, Briefcase } from "lucide-react";
import MuiDropdown from "@/app/components/MuiDropdown";

const ManageUsers = ({ role }) => {
    const [users, setUsers] = useState([]);
    const [customId, setCustomId] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statsCount, setStatsCount] = useState({})
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openManage, setOpenManage] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [confirmInput, setConfirmInput] = React.useState("");

    // ✅ Fetch Users from API
    const fetchUsers = async (pageNumber = 1, query = "") => {
        try {
            setLoading(true);
            const res = await fetch(
                `http://localhost:3001/api/dashboard/users?customId=${query}&page=${pageNumber}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setTotalPages(data.totalPages || 1);
                setStatsCount(data.roleCountMap || {})
                console.log(data)
            } else setUsers([]);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page, customId);
    }, [page]);

    const handleSearch = () => {
        setPage(1);
        fetchUsers(1, customId);
    };

    // ✅ Manage Popup Handlers
    const handleManage = (user) => {
        setSelectedUser(user);
        setOpenManage(true);
    };

    const handleClose = () => {
        setOpenManage(false);
        setSelectedUser(null);
    };


    const handleAssignRole = async () => {
        if (!selectedUser) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/dashboard/role/${selectedUser._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: selectedRole }),
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (data.success) {
                alert(`✅ Role updated to ${selectedRole}`);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === selectedUser._id
                            ? { ...user, role: selectedRole }
                            : user
                    )
                );
                setSelectedUser((prev) =>
                    prev ? { ...prev, role: selectedRole } : prev
                );
                handleClose();
            } else {
                throw new Error(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error updating role:", err);
        }
    };


    const handleOpenConfirm = () => {
        setConfirmInput("");
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        if (confirmInput.trim() !== selectedUser.userName) {
            alert("❌ Username does not match. Please type correctly to confirm.");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:3001/api/dashboard/users/${selectedUser._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await res.json();

            if (data.success) {
                alert(`🗑️ User "${selectedUser.userName}" deleted successfully`);

                // 🔹 Remove deleted user locally (no need to refetch)
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== selectedUser._id)
                );

                // 🔹 Close modals after update
                handleCloseConfirm();
                handleClose();
            } else {
                alert(data.message || "Failed to delete user");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("⚠️ Something went wrong while deleting the user.");
        }
    };


    // ✅ Role Chip Colors
    const getRoleChipColor = (role) => {
        switch (role) {
            case "admin":
                return {
                    bgColor: "bg-red-50",
                    textColor: "text-red-700",
                    borderColor: "border-red-200",
                    dotColor: "bg-red-500",
                    label: "Admin"
                };
            case "manager":
                return {
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-700",
                    borderColor: "border-blue-200",
                    dotColor: "bg-blue-500",
                    label: "Manager"
                };
            case "moderator":
                return {
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-700",
                    borderColor: "border-purple-200",
                    dotColor: "bg-purple-500",
                    label: "Moderator"
                };
            default:
                return {
                    bgColor: "bg-green-50",
                    textColor: "text-green-700",
                    borderColor: "border-green-200",
                    dotColor: "bg-green-500",
                    label: "User"
                };
        }
    };


    const roleOptions = [
        {
            value: "admin",
            label: (
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    Admin - Full system access
                </div>
            ),
        },
        {
            value: "manager",
            label: (
                <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    Manager - Limited administrative access
                </div>
            ),
        },
        {
            value: "user",
            label: (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    User - Basic access only
                </div>
            ),
        },
    ];


    const filteredRoleOptions = roleOptions.filter(option => {
    // Hide "admin" if currentRole is "manager"
    if (role === "manager" && option.value === "admin") return false;
    return true;
});

    return (
        <div className="min-h-screen rounded-[20px]  bg-white px-4 sm:px-6 py-6  max-w-6xl w-[95%] mx-auto py-8">
            {/* Header Section */}
            <div className="flex flex-col gap-y-[22px] mb-8">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        User Management {role}
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm">Manage user roles and permissions</p>
                </div>

                {/* Search Box */}
               <div className="flex flex-col sm:flex-row items-center gap-3 max-w-[500px] w-[100%] lg:w-auto">
  <div className="relative flex-1 w-full items-center">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder="Search by Custom ID"
      value={customId}
      onChange={(e) => setCustomId(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent form submission if wrapped in form
          handleSearch();
        }
      }}
      className="
        normal_input mod_2
      "
      aria-label="Search by Custom ID"
    />
    
    {/* Clear button inside input when customId exists */}
    {customId && (
      <button
        onClick={() => {
          setCustomId('');
          // Optionally trigger search when clearing
          // handleSearch(); 
        }}
        className="
          absolute right-3 top-1/2 transform -translate-y-1/2
          text-gray-400 hover:text-gray-600
          transition-colors duration-200
          p-1 rounded-full
          hover:bg-gray-100
        "
        aria-label="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>

  {/* Conditional Clear Search Button */}
  {customId && (
    <button
      onClick={() => {
        setCustomId('');
        // Optionally trigger search when clearing
        // handleSearch();
      }}
      className="
        px-4 py-2
        border border-gray-300
        rounded-[50px]
        text-gray-700
        hover:bg-gray-50
        hover:border-gray-400
        active:bg-gray-100
        transition-all duration-200
        font-medium
        whitespace-nowrap
        shadow-sm
      "
    >
      Clear Search
    </button>
  )}
</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{statsCount?.user}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                {
                    role == "admin" && <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-gray-900">{statsCount?.admin}</p>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Shield className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>
                }
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Managers</p>
                            <p className="text-2xl font-bold text-gray-900">{statsCount?.manager}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Agents</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statsCount?.agent || 0}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Briefcase className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                        <p className="text-gray-600 font-medium">Loading users...</p>
                    </div>

                ) : users.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 max-w-sm mx-auto">
                            {customId ? `No users found for "${customId}". Try a different search term.` : 'No users available in the system.'}
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
                                            User Details
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Custom ID
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="py-4 px-6 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user, index) => {
                                        const role = getRoleChipColor(user.role);
                                        return (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-blue-50/30 transition-all duration-150 group border-b border-gray-100 last:border-b-0"
                                            >
                                                <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                                                    {(page - 1) * 10 + index + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                            {user.userName}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">{user.Email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-[12px] text-gray-900 font-medium tracking-wide">
                                                        {user.customId}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${role.bgColor} ${role.borderColor} ${role.textColor} transition-all duration-200 hover:scale-105 hover:shadow-sm`}>
                                                        <div className={`w-2 h-2 rounded-full ${role.dotColor} animate-pulse`}></div>
                                                        <span className="text-xs font-semibold tracking-wide uppercase">
                                                            {role.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => handleManage(user)}
                                                        className="inline-flex items-center cursor-pointer gap-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group-hover:shadow-sm"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Manage
                                                    </button>
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

            {/* Pagination */}
            {users.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                    <p className="text-sm text-gray-600">
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, users.length)} of {users.length} users
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
                                borderRadius: '50px',
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

            {/* Manage User Modal (Tailwind Custom) */}
            {openManage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <UserCog className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Manage User</h2>
                                    <p className="text-sm text-gray-600">
                                        {selectedUser?.userName} • {selectedUser?.Email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-6">
                            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm text-blue-800">
                                        Changing user roles will affect their system permissions and access levels.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <MuiDropdown
                                    title="Assign Role"
                                    options={filteredRoleOptions}
                                    value={selectedRole}
                                    onChange={(val) => setSelectedRole(val)}
                                    placeholder="Select role..."
                                    optionType="object"
                                />
                            </div>
                            <button
                                onClick={handleOpenConfirm}
                                className="flex-1 border border-red-300 text-red-500 font-semibold cursor-pointer py-[4px] px-[10px] text-[12px] rounded-[50px] hover:bg-red-50 transition-all duration-200"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete User
                                </div>
                            </button>


                        </div>





                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row gap-3 px-6 py-5 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleAssignRole}
                                disabled={selectedRole === ""}
                                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-[500] text-[16px] py-2.5 rounded-[50px] cursor-pointer 
        hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg
        flex items-center justify-center gap-2
        ${selectedRole === "" ? "opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-700 shadow-none" : ""}`}
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}

            {confirmOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            To confirm, please type <strong>{selectedUser?.userName}</strong> below.
                            This action is <span className="text-red-600 font-medium">irreversible</span>.
                        </p>

                        <input
                            type="text"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder={`Type "${selectedUser?.userName}" to confirm`}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={handleCloseConfirm}
                                className="px-4 py-2 rounded-[50px] cursor-pointer text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className={`px-4 py-2 rounded-[50px] cursor-pointer font-medium text-white transition-all ${confirmInput.trim() === selectedUser?.userName
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-300 cursor-not-allowed"
                                    }`}
                                disabled={confirmInput.trim() !== selectedUser?.userName}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default ManageUsers