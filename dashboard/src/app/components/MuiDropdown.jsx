"use client";
import React, { useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
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
    info = null, // ✅ new prop
}) => {
    const [showInfo, setShowInfo] = useState(false); // ✅ local state

    // Normalize options to always be {value, label}
    const normalizedOptions = React.useMemo(() => {
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

    // Get label for locked mode
    const selectedLabel =
        normalizedOptions.find((opt) => opt.value === value)?.label || placeholder;

    const handleLockedClick = () => {
        if (locked && info) {
            setShowInfo(true);
            setTimeout(() => setShowInfo(false), 3000); // auto-hide after 3s
        }
    };

    return (
        <div className="sort_box flex flex-col gap-2 w-full">
            {title && (
                <span className={`btes ${inter.className} fw_500 block w-full`}>
                    {title}:
                </span>
            )}
            <FormControl sx={{ minWidth: "100%", width: "100%" }}>
                {locked ? (
                    // ✅ Locked Mode: Show plain text but clickable
                    <div
                        onClick={handleLockedClick}
                        className="px-3 py-2 border border-gray-300 text-sm bg-gray-100 text-gray-700 w-full select-none"
                        style={{
                            fontFamily: inter.style.fontFamily,
                            borderRadius: 0,
                        }}
                    >
                        {selectedLabel}
                    </div>
                ) : (
                    // ✅ Normal Dropdown
                    <Select
                        value={value ?? defaultValue}
                        onChange={(e) => onChange?.(e.target.value)}
                        size="small"
                        displayEmpty
                        sx={{
                            borderRadius: 0,
                            fontFamily: inter.style.fontFamily,
                            fontSize: "14px",
                            width: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 0,
                                borderColor: "#ccc",
                                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#86b7fe",
                                boxShadow: "0 0 0 1px rgba(13, 110, 253, 0.25)",
                            },
                            "& .MuiSelect-select": {
                                paddingTop: "12px",   // py-3
                                paddingBottom: "12px",
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: 0,
                                    mt: "10px",
                                },
                            },
                        }}
                    >
                        {/* ✅ Placeholder */}
                        <MenuItem value="" disabled>
                            <em>{placeholder}</em>
                        </MenuItem>

                        {normalizedOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    fontFamily: inter.style.fontFamily,
                                    fontSize: "14px",
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </FormControl>

            {/* ✅ Info message only when locked + clicked */}
            {showInfo && info && (
                <div className="mt-1 text-xs px-2 py-1 font-[500] rounded-[50px] bg-blue-50 text-blue-700 border border-blue-200">
                    {typeof info === "string"
                        ? info
                        : "Please select an option from the list."}
                </div>
            )}
        </div>
    );
};

export default MuiDropdown;
