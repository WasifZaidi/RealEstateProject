"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Select, MenuItem, FormControl, TextField, InputAdornment, Box } from "@mui/material";
import { Search, X, ChevronDown, Info } from "lucide-react";
import { inter } from "@/utils/fonts";

const MuiDropdown = ({
    options,
    title,
    value,
    onChange,
    defaultValue = "",
    placeholder = "Select an option",
    optionType = "auto",
    locked = false,
    info = null,
    searchable = true, // ✅ New prop to enable/disable search
    minHeight = "300px", // ✅ New prop for minimum height
}) => {
    const [showInfo, setShowInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Normalize options to always be {value, label}
    const normalizedOptions = useMemo(() => {
        if (!options) return [];

        if (optionType === "string") {
            return options.map((opt) => ({ value: opt, label: opt }));
        }
        if (optionType === "object") {
            return options.map((opt) => ({
                value: opt.value,
                label: opt.label ?? opt.value,
            }));
        }

        return typeof options[0] === "string"
            ? options.map((opt) => ({ value: opt, label: opt }))
            : options.map((opt) => ({
                value: opt.value,
                label: opt.label ?? opt.value,
            }));
    }, [options, optionType]);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return normalizedOptions;
        
        return normalizedOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [normalizedOptions, searchTerm]);

    // Reset search when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
        }
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, searchable]);

    const handleLockedClick = () => {
        if (locked && info) {
            setShowInfo(true);
            setTimeout(() => setShowInfo(false), 3000);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
        searchInputRef.current?.focus();
    };

    const handleMenuItemClick = (optionValue) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    // Custom dropdown icon
    const CustomDropdownIcon = (props) => (
        <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${props.className || ''}`}
        />
    );

    return (
        <div className="sort_box flex flex-col gap-2 w-full">
            {title && (
                <span className={`btes ${inter.className} fw_500 block w-full text-sm font-semibold text-gray-700`}>
                    {title}
                </span>
            )}
            
            <FormControl sx={{ minWidth: "100%", width: "100%" }}>
                {locked ? (
                    // ✅ Locked Mode: Show plain text but clickable
                    <div
                        onClick={handleLockedClick}
                        className="px-4 py-3 border border-gray-300 text-sm bg-gray-100 text-gray-700 w-full select-none rounded-xl flex items-center justify-between cursor-not-allowed"
                        style={{
                            fontFamily: inter.style.fontFamily,
                        }}
                    >
                        <span>{selectedLabel}</span>
                        <Info className="w-4 h-4 text-gray-500" />
                    </div>
                ) : (
                    // ✅ Enhanced Dropdown with Search
                    <Select
                        value={value ?? defaultValue}
                        onChange={(e) => onChange?.(e.target.value)}
                        onOpen={() => setIsOpen(true)}
                        onClose={() => setIsOpen(false)}
                        open={isOpen}
                        size="small"
                        displayEmpty
                        IconComponent={CustomDropdownIcon}
                        sx={{
                            borderRadius: "12px",
                            fontFamily: inter.style.fontFamily,
                            fontSize: "14px",
                            width: "100%",
                            backgroundColor: "white",
                            transition: "all 0.2s ease-in-out",
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "2px solid #e5e7eb",
                                borderRadius: "12px",
                                transition: "all 0.2s ease-in-out",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3b82f6",
                                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3b82f6",
                                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                            },
                            "& .MuiSelect-select": {
                                paddingTop: "12px",
                                paddingBottom: "12px",
                                paddingLeft: "16px",
                                display: "flex",
                                alignItems: "center",
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: "12px",
                                    mt: "8px",
                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                    border: "1px solid #e5e7eb",
                                    minHeight: minHeight, // ✅ Apply minimum height
                                    maxHeight: "400px", // ✅ Maximum height for very long lists
                                },
                            },
                            MenuListProps: {
                                sx: {
                                    padding: 0,
                                },
                            },
                        }}
                        renderValue={(selected) => {
                            if (!selected) {
                                return (
                                    <span className="text-gray-400">
                                        {placeholder}
                                    </span>
                                );
                            }
                            const selectedOption = normalizedOptions.find(opt => opt.value === selected);
                            return selectedOption?.label || placeholder;
                        }}
                    >
                        {/* ✅ Search Input Header */}
                        {searchable && (
                            <Box 
                                sx={{ 
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #f3f4f6",
                                    backgroundColor: "#fafafa",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                <TextField
                                    inputRef={searchInputRef}
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search className="w-4 h-4 text-gray-400" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchTerm && (
                                            <InputAdornment position="end">
                                                <button
                                                    onClick={clearSearch}
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <X className="w-3 h-3 text-gray-400" />
                                                </button>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#d1d5db",
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {/* ✅ Search Results Count */}
                        {searchable && searchTerm && (
                            <Box 
                                sx={{ 
                                    padding: "8px 16px",
                                    backgroundColor: "#f8fafc",
                                    borderBottom: "1px solid #f1f5f9",
                                    fontSize: "12px",
                                    color: "#64748b",
                                    fontFamily: inter.style.fontFamily,
                                }}
                            >
                                {filteredOptions.length} result{filteredOptions.length !== 1 ? 's' : ''} found
                            </Box>
                        )}

                        {/* ✅ Placeholder for empty search */}
                        {searchTerm && filteredOptions.length === 0 && (
                            <MenuItem disabled sx={{ fontFamily: inter.style.fontFamily }}>
                                <div className="text-center py-4 text-gray-500 w-full">
                                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <div>No results found for "{searchTerm}"</div>
                                    <div className="text-xs mt-1">Try different keywords</div>
                                </div>
                            </MenuItem>
                        )}

                        {/* ✅ Options List */}
                        {filteredOptions.map((option, i) => (
                            <MenuItem
                                key={i}
                                value={option.value}
                                onClick={() => handleMenuItemClick(option.value)}
                                sx={{
                                    fontFamily: inter.style.fontFamily,
                                    fontSize: "14px",
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #f8fafc",
                                    "&:last-child": {
                                        borderBottom: "none",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f0f9ff",
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "#dbeafe",
                                        "&:hover": {
                                            backgroundColor: "#bfdbfe",
                                        },
                                    },
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </FormControl>

            {/* ✅ Enhanced Info Message */}
            {showInfo && info && (
                <div className="mt-1 text-xs px-3 py-2 font-medium rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2 animate-in fade-in duration-200">
                    <Info className="w-3 h-3" />
                    {typeof info === "string"
                        ? info
                        : "Please select an option from the list."}
                </div>
            )}
        </div>
    );
};

export default MuiDropdown;