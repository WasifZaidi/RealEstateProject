"use client"
import React, { useEffect, useState } from "react";
import { FaHome, FaBuilding, FaCity, FaTree, FaMapMarkerAlt, FaChevronRight, FaCheck, FaMap, FaRulerCombined, FaExpand, FaDollarSign, FaExclamationTriangle, FaEye, FaChevronLeft, FaImages, FaCloudUploadAlt, FaVideo, FaPlus, FaImage, FaLightbulb, FaSun, FaVectorSquare, FaTrash, FaGripVertical, FaPlay, FaStar, FaBath, FaBed, FaSignature, FaUmbrellaBeach, FaFire, FaSwimmingPool, FaUtensils, FaSoap, FaMicrophone, FaSnowflake, FaThermometerHalf, FaTshirt, FaShieldAlt, FaLock, FaCar, FaWarehouse, FaChair, FaCouch, FaPaw, FaWheelchair, FaWifi, FaSeedling, FaEdit, FaChevronDown, FaHeart, FaTag, FaHandshake, FaIndustry } from "react-icons/fa";
import { US_STATES, US_CITIES } from "../../../../utils/usData"
import MuiDropdown from "@/app/components/MuiDropdown";
import CustomToast from "@/app/components/CustomToast";
import { useRef } from "react";
import { uploadListing } from "@/utils/api";
import {propertyTypes} from "@/app/constants/propertyTypes"
import {amenities} from "@/app/constants/amenities"
const Page = () => {
    const [activeTab, setActiveTab] = useState("Residential");
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedProperty, setSelectedProperty] = useState("");
    const [propertyFor, setPropertyFor] = useState("");
    const [priceType, setPriceType] = useState("fixed");
    const [state, setState] = useState("")
    const [city, setCity] = useState("");
    const [size, setSize] = useState("");
    const [price, setPrice] = useState("");
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    // Add these to your existing state variables
    const [propertyName, setPropertyName] = useState('');
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [description, setDescription] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [owner, setOwner] = useState("xyz owner")
    const [agent, setagent] = useState("xyz agent")
    const [errors, setErrors] = useState({})
    const [toast, setToast] = useState(null);
    // Amenities data
    const amenities = [
        // Living Features
        { id: 'balcony', label: 'Balcony', icon: FaUmbrellaBeach, color: 'text-blue-500' },
        { id: 'garden', label: 'Garden', icon: FaSeedling, color: 'text-green-500' },
        { id: 'fireplace', label: 'Fireplace', icon: FaFire, color: 'text-red-500' },
        { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool, color: 'text-blue-400' },

        // Kitchen Features
        { id: 'modern-kitchen', label: 'Modern Kitchen', icon: FaUtensils, color: 'text-gray-600' },
        { id: 'dishwasher', label: 'Dishwasher', icon: FaSoap, color: 'text-blue-300' },
        { id: 'microwave', label: 'Microwave', icon: FaMicrophone, color: 'text-gray-500' },

        // Utilities
        { id: 'ac', label: 'Air Conditioning', icon: FaSnowflake, color: 'text-blue-300' },
        { id: 'heating', label: 'Heating', icon: FaThermometerHalf, color: 'text-orange-500' },
        { id: 'washer-dryer', label: 'Washer/Dryer', icon: FaTshirt, color: 'text-purple-500' },

        // Security
        { id: 'security-system', label: 'Security System', icon: FaShieldAlt, color: 'text-green-600' },
        { id: 'gated-community', label: 'Gated Community', icon: FaLock, color: 'text-gray-700' },
        { id: 'cctv', label: 'CCTV', icon: FaVideo, color: 'text-red-600' },

        // Outdoor
        { id: 'parking', label: 'Parking', icon: FaCar, color: 'text-gray-600' },
        { id: 'garage', label: 'Garage', icon: FaWarehouse, color: 'text-gray-700' },
        { id: 'patio', label: 'Patio', icon: FaChair, color: 'text-brown-500' },

        // Additional
        { id: 'furnished', label: 'Furnished', icon: FaCouch, color: 'text-yellow-600' },
        { id: 'pet-friendly', label: 'Pet Friendly', icon: FaPaw, color: 'text-brown-400' },
        { id: 'wheelchair-accessible', label: 'Wheelchair Access', icon: FaWheelchair, color: 'text-blue-600' },

        // Tech
        { id: 'high-speed-internet', label: 'High-Speed Internet', icon: FaWifi, color: 'text-purple-500' },
        { id: 'smart-home', label: 'Smart Home', icon: FaHome, color: 'text-green-500' },
    ];

    // constants/propertyTypes.js
    const PropertyButton = ({ property, isSelected, handlePropertySelect }) => {
        const IconComponent = property.icon;

        // Blue theme for all selected buttons
        const colorClasses = isSelected
            ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300";

        return (
            <button
                onClick={() => { setSelectedProperty(property.id); }}
                className={`flex cursor-pointer flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 min-w-[120px] group ${colorClasses}`}
            >
                <div className="relative">
                    <IconComponent className="text-2xl mb-2" />
                    {isSelected && (
                        <FaCheck className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full p-1 text-xs" />
                    )}
                </div>
                <span className="font-[600] text-sm text-center">{property.label}</span>
            </button>
        );
    };
    const availableCities = US_CITIES[state] || []
    const handlePriceChange = (e) => {
        const rawValue = e.target.value;

        // Remove commas and parse number
        const numericValue = rawValue.replace(/,/g, "");

        if (!/^\d*$/.test(numericValue)) {
            setError("Price must contain only numbers");
            return;
        }

        const value = parseInt(numericValue, 10);

        // Empty case
        if (numericValue === "") {
            setPrice("");
            setError("");
            return;
        }

        // ✅ Only check maximum while typing
        if (value > 100000000) {
            setError("Asking price cannot exceed $100,000,000");
        } else {
            setError("");
        }

        // Format with commas for readability
        setPrice(
            new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
            }).format(value)
        );
    };
    const MAX_FILES = 12; // Increased for comprehensive property coverage
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10MB (increased for high-quality photos)
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100MB (for property tours)
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/avi"];
    const MIN_IMAGE_WIDTH = 640;  // Minimum width for quality display
    const MIN_IMAGE_HEIGHT = 480; // Minimum height for quality display
    const ASPECT_RATIO_TOLERANCE = 0.2; // Allow some flexibility in aspect ratio
    const trimFileName = (name, maxLength = 15) => {
        if (name.length <= maxLength) return name;
        const ext = name.split(".").pop();
        return name.slice(0, maxLength - ext.length - 3) + "..." + ext;
    };
    const validateImageDimensions = (file, minWidth, minHeight) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const isValid = img.width >= minWidth && img.height >= minHeight;
                const aspectRatio = img.width / img.height;
                const isStandardRatio = aspectRatio >= 1.2 && aspectRatio <= 1.8; // Common real estate aspect ratios
                resolve({ isValid, width: img.width, height: img.height, isStandardRatio });
            };
            img.onerror = () => resolve({ isValid: false });
            img.src = URL.createObjectURL(file);
        });
    };
    const handleFileChange = async (e) => {
        setError(null);
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            return setError(`Maximum ${MAX_FILES} files allowed. You have ${files.length}/${MAX_FILES}.`);
        }

        const newFiles = [];
        const newPreviews = [];

        for (const file of selectedFiles) {
            try {
                // Check file type
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");

                if (!isImage && !isVideo) {
                    setError(`Unsupported file type: ${trimFileName(file.name)} (Allowed: JPEG, PNG, WebP, MP4, MOV, AVI)`);
                    setToast({ type: "error", message: `Unsupported file type: ${trimFileName(file.name)} (Allowed: JPEG, PNG, WebP, MP4, MOV, AVI)` });
                    continue;
                }

                if (isImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    setError(`Image type not allowed: ${trimFileName(file.name)} (Allowed: JPEG, PNG, WebP)`);
                    setToast({ type: "error", message: `Image type not allowed: ${trimFileName(file.name)} (Allowed: JPEG, PNG, WebP)` });
                    continue;
                }

                if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
                    setError(`Video type not allowed: ${trimFileName(file.name)} (Allowed: MP4, MOV, AVI)`);
                    setToast({ type: "error", message: `Video type not allowed: ${trimFileName(file.name)} (Allowed: MP4, MOV, AVI)` });
                    continue;
                }

                // Check file size
                if (isImage && file.size > MAX_IMAGE_SIZE) {
                    setError(`Image too large: ${trimFileName(file.name)} (Max: 10MB)`);
                    setToast({ type: "error", message: `Image too large: ${trimFileName(file.name)} (Max: 10MB)` });
                    continue;
                }

                if (isVideo && file.size > MAX_VIDEO_SIZE) {
                    setError(`Video too large: ${trimFileName(file.name)} (Max: 100MB)`);
                    setToast({ type: "error", message: `Video too large: ${trimFileName(file.name)} (Max: 100MB)` });
                    continue;
                }

                // Validate image dimensions and quality
                if (isImage) {
                    const dimensionCheck = await validateImageDimensions(file, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT);

                    if (!dimensionCheck.isValid) {
                        setError(`Low resolution: ${trimFileName(file.name)} (Minimum: ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px)`);
                        setToast({ type: "error", message: `Low resolution: ${trimFileName(file.name)} (Minimum: ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px)` });
                        continue;
                    }

                    if (!dimensionCheck.isStandardRatio) {
                        setError(`Non-standard aspect ratio: ${trimFileName(file.name)} (Recommended: 4:3 or 16:9)`);
                        setToast({ type: "error", message: `Non-standard aspect ratio: ${trimFileName(file.name)} (Recommended: 4:3 or 16:9)` });
                        continue;
                    }
                }

                // Check video duration (if possible)
                if (isVideo) {
                    const duration = await getVideoDuration(file);
                    if (duration > 300) { // 5 minutes max
                        setError(`Video too long: ${trimFileName(file.name)} (Max: 5 minutes)`);
                        setToast({ type: "error", message: `Non-standard aspect ratio: ${trimFileName(file.name)} (Recommended: 4:3 or 16:9)` });
                        continue;
                    }
                }

                // Create preview
                const objectUrl = URL.createObjectURL(file);
                newFiles.push(file);
                newPreviews.push({
                    src: objectUrl,
                    type: file.type.startsWith("video/") ? "video" : "image",
                    name: file.name,
                    size: file.size,
                    duration: file.type.startsWith("video/") ? await getVideoDuration(file) : null
                });


            } catch (error) {
                console.error("Error processing file:", error);
                setError(`Error processing ${trimFileName(file.name)}`);
                continue;
            }
        }


        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);

            // If this is the first file being added, set it as cover if it's an image
            if (files.length === 0 && newFiles.some(file => file.type.startsWith("image/"))) {
                const firstImageIndex = newPreviews.findIndex(preview => preview.type === 'image');
                if (firstImageIndex !== -1) {
                    setCoverPhotoIndex(firstImageIndex);
                }
            }
        }


        // Clear input
        e.target.value = "";
    };
    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                resolve(video.duration);
                URL.revokeObjectURL(video.src);
            };
            video.src = URL.createObjectURL(file);
        });
    };
    const removeFile = (index) => {
        // Revoke object URL
        URL.revokeObjectURL(previews[index].src);

        // Adjust cover photo index if needed
        if (index === coverPhotoIndex) {
            // Find next available image to set as cover
            const remainingImages = previews.filter((_, i) => i !== index)
                .map((preview, newIndex) => ({ preview, originalIndex: newIndex < index ? newIndex : newIndex + 1 }))
                .filter(({ preview }) => preview.type === 'image');

            if (remainingImages.length > 0) {
                setCoverPhotoIndex(remainingImages[0].originalIndex);
            } else {
                setCoverPhotoIndex(0); // Reset to first file if no images left
            }
        } else if (index < coverPhotoIndex) {
            // Adjust cover photo index if removing a file before it
            setCoverPhotoIndex(prev => prev - 1);
        }

        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };
    const setAsCoverPhoto = (index) => {
        if (previews[index].type === 'image') {
            setCoverPhotoIndex(index);
        }
    };
    const moveFile = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;

        const newFiles = [...files];
        const newPreviews = [...previews];

        const [movedFile] = newFiles.splice(fromIndex, 1);
        const [movedPreview] = newPreviews.splice(fromIndex, 1);

        newFiles.splice(toIndex, 0, movedFile);
        newPreviews.splice(toIndex, 0, movedPreview);

        setFiles(newFiles);
        setPreviews(newPreviews);

        // Adjust cover photo index
        if (fromIndex === coverPhotoIndex) {
            setCoverPhotoIndex(toIndex);
        } else {
            if (fromIndex < coverPhotoIndex && toIndex >= coverPhotoIndex) {
                setCoverPhotoIndex(prev => prev - 1);
            } else if (fromIndex > coverPhotoIndex && toIndex <= coverPhotoIndex) {
                setCoverPhotoIndex(prev => prev + 1);
            }
        }
    };
    const reorderFiles = (startIndex, endIndex) => {
        moveFile(startIndex, endIndex);
    };
    useEffect(() => {
        if (previews.length > 0) {
            const firstImageIndex = previews.findIndex(preview => preview.type === 'image');
            if (firstImageIndex !== -1 && coverPhotoIndex !== firstImageIndex) {
                setCoverPhotoIndex(firstImageIndex);
            }
        }
    }, [previews]);
    // File Card Component
    const FileCard = ({ preview, index, onRemove, onReorder, onSetCover, isCover, canSetCover }) => {
        const [isDragging, setIsDragging] = useState(false);
        const [showActions, setShowActions] = useState(false);

        return (
            <div
                className={`relative group bg-gray-50 rounded-xl border-2 overflow-hidden transition-all duration-300 ${isCover
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    } ${isDragging ? 'scale-105 border-blue-400 shadow-lg z-10' : ''}`}
                draggable
                onDragStart={(e) => {
                    setIsDragging(true);
                    e.dataTransfer.setData('text/plain', index);
                }}
                onDragEnd={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    onReorder(fromIndex, index);
                }}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* Cover Photo Badge */}
                {isCover && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1">
                        <FaStar className="text-xs" />
                        Cover Photo
                    </div>
                )}

                {/* Position Indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
                    #{index + 1}
                </div>

                {/* Main Content */}
                <div className="aspect-video relative">
                    {preview.type === "image" ? (
                        <img
                            src={preview.src}
                            alt={`Property visual ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            <video
                                src={preview.src}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {Math.round(preview.duration)}s
                            </div>
                            <FaPlay className="absolute inset-0 m-auto text-white text-2xl opacity-80" />
                        </>
                    )}

                    {/* Overlay Actions */}
                    <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center ${showActions ? 'bg-opacity-40' : 'opacity-0'
                        }`}>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onRemove(index)}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                title="Remove file"
                            >
                                <FaTrash className="text-sm" />
                            </button>

                            {canSetCover && (
                                <button
                                    onClick={() => onSetCover(index)}
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    title="Set as cover photo"
                                >
                                    <FaStar className="text-sm" />
                                </button>
                            )}

                            <button
                                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors cursor-grab active:cursor-grabbing"
                                title="Drag to reorder"
                            >
                                <FaGripVertical className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File Info */}
                <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate flex-1">
                            {trimFileName(preview.name)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{(preview.size / 1024 / 1024).toFixed(1)}MB</span>
                        <span className="flex items-center gap-1">
                            {preview.type === 'image' ? (
                                <FaImage className="text-green-500" />
                            ) : (
                                <FaVideo className="text-blue-500" />
                            )}
                            {preview.type}
                        </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <button
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-700 transition-colors text-xs flex items-center gap-1"
                        >
                            <FaTrash />
                            Remove
                        </button>

                        {canSetCover && !isCover && (
                            <button
                                onClick={() => onSetCover(index)}
                                className="text-blue-500 hover:text-blue-700 transition-colors text-xs flex items-center gap-1"
                            >
                                <FaStar />
                                Set Cover
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    // Move File Controls Component
    const MoveFileControls = ({ totalFiles, currentIndex, onMove }) => {
        return (
            <div className="flex flex-col items-center gap-2 bg-gray-100 rounded-lg p-2">
                <span className="text-xs text-gray-600 font-medium">Move to:</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => onMove(currentIndex, 0)}
                        disabled={currentIndex === 0}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Move to first position"
                    >
                        First
                    </button>
                    <button
                        onClick={() => onMove(currentIndex, currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Move left"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={() => onMove(currentIndex, currentIndex + 1)}
                        disabled={currentIndex === totalFiles - 1}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Move right"
                    >
                        <FaChevronRight />
                    </button>
                    <button
                        onClick={() => onMove(currentIndex, totalFiles - 1)}
                        disabled={currentIndex === totalFiles - 1}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Move to last position"
                    >
                        Last
                    </button>
                </div>
            </div>
        );
    };
    const validators = {
        1: () => {
            let errors = {};
            return errors;
        },
        2: () => {
            let errors = {};
            if (!propertyFor) errors.propertyFor = "Please select whether you're selling or renting";
            if (!state) errors.state = "State is required";
            if (!city) errors.city = "City is required";
            if (!size) errors.size = "Property size is required";
            if (!price) errors.price = "Asking price is required";
            return errors;
        },
        3: () => {
            let errors = {};
            return errors;
        },
        4: () => {
            let errors = {};

            // Property name
            if (!propertyName) {
                errors.propertyName = "Property name is required";
            }

            // Description
            if (!description) {
                errors.description = "Description is required";
            }

            // Bedrooms & bathrooms → only if property type is Residential
            const propertyType = propertyTypes[activeTab]?.find(
                (p) => p.id === selectedProperty
            );

            if (propertyType?.category === "Residential") {
                if (!bedrooms) {
                    errors.bedrooms = "Number of bedrooms is required";
                }
                if (bathrooms === null || bathrooms === undefined) {
                    errors.bathrooms = "Number of bathrooms is required";
                }
            }

            return errors;
        }
    };
    const formatNumberWithCommas = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const handleSizeChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (/^\d*$/.test(rawValue)) {
            setSize(formatNumberWithCommas(rawValue));
        }
    };

    const handleContinue = () => {
        const validator = validators[currentStep];
        const newErrors = validator ? validator() : {};
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const fieldRef = inputRefs[firstErrorKey];
            if (fieldRef?.current) {
                fieldRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                fieldRef.current.focus();
            }
            return;
        }
        if (currentStep === 2) {
            setCurrentStep(3);
        } else if (currentStep === 3) {
            setCurrentStep(4);
        } else if (currentStep === 4) {
            handleSubmit(); // ✅ call submit when step 4 is reached
        }


    };


    const selectedPropertyType = propertyTypes[activeTab]?.find(
        (p) => p.id === selectedProperty
    );





    const inputRefs = {
        propertyFor: useRef(null),
        state: useRef(null),
        city: useRef(null),
        size: useRef(null),
        price: useRef(null),
        priceType: useRef(null),
        propertyName: useRef(null),
        description: useRef(null),
        bedrooms: useRef(null),
        bathrooms: useRef(null),
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await uploadListing({
                title: propertyName,
                description,
                selectedProperty,
                activeTab,
                propertyFor,
                state,
                city,
                size,
                price,
                priceType,
                bedrooms,
                bathrooms,
                selectedAmenities,
                owner,
                agent,
                files,
                coverPhotoIndex,
            });

            if (response.success) {
                setToast({ type: "success", message: response.message });
            } else {
                setToast({ type: "error", message: response.message });
            }
        } catch (error) {
            setToast({ type: "error", message: "Failed to submit listing" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <>

            {toast && (
                <CustomToast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                    duration={3000} // auto close after 3s
                />
            )}

            {/* Property Type: */}
            {currentStep === 1 && (
                <div className="flex flex-col max-w-6xl w-[95%] mx-auto py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">What kind of property do you have?</h1>
                        <p className="text-gray-600 text-lg">Select the category that best describes your property</p>
                    </div>
                    {/* Main Card */}
                    <div className="section rounded-3xl bg-white shadow-xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                        {/* Tabs */}
                     <div className="overflow-x-auto flex space-x-1 bg-gray-100 rounded-2xl p-2 mb-8 mx-auto">
  {Object.keys(propertyTypes).map((tab) => (
    <button
      key={tab}
      onClick={() => { setActiveTab(tab); setSelectedProperty(""); }}
      className={`flex-1 min-w-[150px] cursor-pointer py-4 px-6 rounded-[50px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        activeTab === tab
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:text-gray-900 hover:bg-white"
      }`}
    >
      <span className="flex-shrink-0">
        {tab === "Residential" && <FaHome />}
        {tab === "Plot" && <FaTree />}
        {tab === "Commercial" && <FaBuilding />}
        {tab === "Industrial" && <FaIndustry />}
      </span>
      {tab}
    </button>
  ))}
</div>

                        {/* Property Grid */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Select Property Type</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
                                {propertyTypes[activeTab].map((property) => (
                                    <PropertyButton
                                        key={property.id}
                                        property={property}
                                        isSelected={selectedProperty === property.id}
                                        handlePropertySelect={setSelectedProperty}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Selected Property */}
                        {selectedProperty && (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-full bg-blue-100">
                                            {React.createElement(
                                                propertyTypes[activeTab].find(p => p.id === selectedProperty)?.icon,
                                                { className: "text-blue-600" }
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Selected Property</h4>
                                            <p className="text-gray-600">
                                                {propertyTypes[activeTab].find(p => p.id === selectedProperty)?.label}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors"
                                    >
                                        Continue <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map(step => (
                                    <div key={step} className={`w-2 h-2 rounded-full transition-all ${step === 1 ? "bg-blue-600 w-8" : "bg-gray-300"}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">Step 1 of 4</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Size & Price: */}
            {currentStep === 2 && (
                <div className="flex flex-col max-w-4xl w-[95%] mx-auto py-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Tell us about your property
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Help buyers find your property with accurate details
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <div className="section rounded-3xl bg-white shadow-xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                        {/* Progress Header */}
                        <div className="flex items-center justify-between mb-8">
                            {/* Step Indicator */}
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                <span className="text-sm text-gray-600">Step 2 of 4</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`w-2 h-2 rounded-full transition-all ${step === currentStep
                                                ? "bg-blue-600 scale-125"
                                                : step < currentStep
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Left Column - Location & Property Type */}
                            <div className="space-y-6">
                                {/* Property For Dropdown */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                        <FaTag className="text-gray-400 text-xs" />
                                        Property For
                                    </label>
                                    <MuiDropdown
                                        options={[
                                            { label: "Sell", value: "Sell" },
                                            { label: "Rent", value: "Rent" }
                                        ]}
                                        ref={inputRefs.propertyFor}
                                        value={propertyFor}
                                        onChange={setPropertyFor}
                                        placeholder="Select listing type"
                                        className={`w-full ${errors.propertyFor ? "normal_err" : ""}`}
                                    />
                                    {errors.propertyFor && (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <FaExclamationTriangle className="text-xs" />
                                            {errors.propertyFor}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">Choose whether you want to sell or rent this property</p>
                                </div>

                                {/* Location Section */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <FaMapMarkerAlt className="text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                                    </div>

                                    {/* State Dropdown */}
                                    <div className="space-y-2">
                                        <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                            <FaMap className="text-gray-400 text-xs" />
                                            State
                                        </label>
                                        <MuiDropdown
                                            options={US_STATES}
                                            ref={inputRefs.state}
                                            value={state}
                                            onChange={setState}
                                            placeholder="Select your state"
                                            className={`w-full ${errors.state ? "normal_err" : ""}`}
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                <FaExclamationTriangle className="text-xs" />
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>

                                    {/* City Dropdown */}
                                    <div className="space-y-2">
                                        <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                            <FaCity className="text-gray-400 text-xs" />
                                            City
                                        </label>
                                        <MuiDropdown
                                            options={availableCities}
                                            ref={inputRefs.city}
                                            value={city}
                                            onChange={setCity}
                                            locked={availableCities.length === 0}
                                            placeholder={availableCities.length === 0 ? "Select state first" : "Select your city"}
                                            className={`w-full ${errors.city ? "normal_err" : ""}`}
                                        />

                                        {availableCities.length === 0 && (
                                            <p className="text-xs text-gray-500 mt-1">Please select a state first to see available cities</p>
                                        )}
                                        {errors.city && (
                                            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                <FaExclamationTriangle className="text-xs" />
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Property Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <FaRulerCombined className="text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Property Specifications</h3>
                                </div>

                                {/* Property Size Input */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                        <FaExpand className="text-gray-400 text-xs" />
                                        Property Size
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="2,500"
                                            className={`normal_input ${errors.size ? "normal_err" : ""}`}
                                            value={size}
                                            onChange={handleSizeChange}
                                            ref={inputRefs.size}
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                            sq ft
                                        </span>
                                    </div>

                                    {errors.size ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <FaExclamationTriangle className="text-xs" />
                                            {errors.size}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">Enter the total area of your property</p>
                                    )}
                                </div>

                                {/* Asking Price Input */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                        <FaDollarSign className="text-gray-500 text-sm" />
                                        {propertyFor === 'Rent' ? 'Monthly Rent (USD)' : 'Asking Price (USD)'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="text"
                                            ref={inputRefs.price}
                                            placeholder={propertyFor === 'Rent' ? "2,500" : "350,000"}
                                            className={`w-full normal_input mod_1 ${errors.price ? "normal_err" : ""}`}
                                            value={price}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                    {errors.price ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <FaExclamationTriangle className="text-xs" />
                                            {errors.price}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            {propertyFor === 'Rent'
                                                ? 'Enter the monthly rental price'
                                                : 'Enter your desired selling price'
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Price Type Dropdown (only for Sell) */}
                                {propertyFor === 'Sell' && (
                                    <div className="space-y-2">
                                        <label className="font-medium text-gray-700 text-sm flex items-center gap-1">
                                            <FaHandshake className="text-gray-400 text-xs" />
                                            Price Type
                                        </label>
                                        <MuiDropdown
                                            options={[
                                                { label: "Fixed Price", value: "fixed" },
                                                { label: "Negotiable", value: "negotiable" },
                                                { label: "Auction", value: "auction" }
                                            ]}
                                            ref={inputRefs.priceType}
                                            value={priceType}
                                            onChange={setPriceType}
                                            placeholder="Select price type"
                                            className="w-full"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Choose how you want to price your property
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview Card */}
                        {(propertyFor || state || city || size || price) && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-white shadow-sm">
                                            <FaEye className="text-blue-600 text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Property Preview</h4>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                {propertyFor && (
                                                    <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${propertyFor === 'Sell'
                                                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                        }`}>
                                                        <FaTag className="text-xs" />
                                                        For {propertyFor}
                                                    </span>
                                                )}
                                                {state && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                                        <FaMapMarkerAlt className="text-blue-500" />
                                                        {state}
                                                    </span>
                                                )}
                                                {city && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                                        <FaBuilding className="text-green-500" />
                                                        {city}
                                                    </span>
                                                )}
                                                {size && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                                        <FaRulerCombined className="text-purple-500" />
                                                        {size} sq ft
                                                    </span>
                                                )}
                                                {price && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 font-medium">
                                                        <FaDollarSign className="text-green-500" />
                                                        ${price}
                                                        {propertyFor === 'Rent' && '/mo'}
                                                    </span>
                                                )}
                                                {propertyFor === 'Sell' && priceType && (
                                                    <span className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200 font-medium capitalize">
                                                        <FaHandshake className="text-yellow-500" />
                                                        {priceType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleContinue}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Continue <FaChevronRight className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                <FaChevronLeft /> Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visuals */}
            {currentStep === 3 && (
                <div className="flex flex-col max-w-6xl w-[95%] mx-auto py-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Showcase Your Property
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Upload high-quality photos and videos to attract serious buyers
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <div className="section rounded-3xl bg-white shadow-xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                        {/* Progress Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <FaImages className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 font-medium">Step 3 • Property Visuals</span>
                                    <h3 className="font-semibold text-gray-900">Create an engaging gallery</h3>
                                </div>
                            </div>

                            {/* Step Indicator */}
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                <span className="text-sm text-gray-600">Step 3 of 4</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`w-2 h-2 rounded-full transition-all ${step === currentStep
                                                ? "bg-blue-600 scale-125"
                                                : step < currentStep
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="mb-8">
                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${files.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                                }`}>
                                <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {files.length > 0 ? `Great! ${files.length}/${MAX_FILES} files uploaded` : 'Drag & drop your files here'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Upload photos (JPEG, PNG, WebP) and videos (MP4, MOV, AVI)
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaImage className="text-green-500" />
                                        <span>Photos: Up to 10MB each</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaVideo className="text-blue-500" />
                                        <span>Videos: Up to 100MB each</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-yellow-500" />
                                        <span>First image becomes cover photo</span>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/mov,video/avi"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                                >
                                    <FaPlus />
                                    Choose Files
                                </label>
                            </div>

                        </div>

                        {/* File Previews Grid */}
                        {previews.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <FaImages />
                                            Your Property Gallery ({previews.length}/{MAX_FILES})
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Cover photo will be featured as the main thumbnail. Drag to reorder or click ★ to set as cover.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <FileCard
                                                preview={preview}
                                                index={index}
                                                onRemove={removeFile}
                                                onReorder={reorderFiles}
                                                onSetCover={setAsCoverPhoto}
                                                isCover={index === coverPhotoIndex}
                                                canSetCover={preview.type === 'image'}
                                            />

                                            {/* Move Controls for each file */}
                                            <div className="mt-2">
                                                <MoveFileControls
                                                    totalFiles={previews.length}
                                                    currentIndex={index}
                                                    onMove={moveFile}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {previews.length < MAX_FILES && (
                                        <label
                                            htmlFor="file-upload"
                                            className="border-2 border-dashed border-gray-300 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                        >
                                            <FaPlus className="text-2xl text-gray-400 group-hover:text-blue-500 mb-2" />
                                            <span className="text-sm text-gray-600 group-hover:text-blue-600">Add More</span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {MAX_FILES - previews.length} remaining
                                            </span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <FaExclamationTriangle className="text-red-500" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        )}

                        {/* Cover Photo Info */}
                        {coverPhotoIndex !== null && previews[coverPhotoIndex] && (
                            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <FaStar className="text-yellow-500 text-xl" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Cover Photo Selected</h4>
                                        <p className="text-sm text-gray-600">
                                            "{previews[coverPhotoIndex].name}" will be featured as your property's main image
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                <FaChevronLeft /> Back
                            </button>

                            <button
                                onClick={() => setCurrentStep(4)}
                                disabled={files.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                Next Step <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                currentStep === 4 && (
                    <div className="flex flex-col max-w-4xl w-[95%] mx-auto py-8">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Finalize Your Property Details
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Add the finishing touches to make your listing stand out
                            </p>
                        </div>

                        {/* Main Content Card */}
                        <div className="section rounded-3xl bg-white shadow-xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                            {/* Progress Header */}
                            <div className="flex items-center justify-between mb-8">
                                {/* Step Indicator */}
                                <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-200 px-4 py-2 rounded-full">
                                    <span className="text-sm text-gray-700">Step 4 of 4</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div
                                                key={step}
                                                className={`w-2 h-2 rounded-full transition-all ${step === currentStep
                                                    ? "bg-blue-600 scale-125"
                                                    : step < currentStep
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="flex flex-col gap-8 mb-8">
                                {/* Left Column - Basic Details */}
                                <div className="space-y-6">
                                    {/* Property Name */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-semibold text-gray-900 flex items-center gap-2">
                                                <FaSignature className="text-blue-500" />
                                                Name Your Property
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                {propertyName.length}/100
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                ref={inputRefs.propertyName}
                                                placeholder="e.g., Modern Downtown Apartment with City Views"
                                                className={`normal_input ${errors.propertyName ? "normal_err" : ""}`}
                                                value={propertyName}
                                                onChange={(e) => setPropertyName(e.target.value)}
                                                maxLength={100}
                                            />
                                        </div>
                                        {errors.propertyName ? (
                                            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                <FaExclamationTriangle className="text-xs" />
                                                {errors.propertyName}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500">
                                                Choose a catchy name that highlights your property's best features
                                            </p>
                                        )}

                                    </div>

                                    {/* Bedrooms & Bathrooms */}
                                    {
                                        selectedPropertyType.category === "Residential" && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Bedrooms */}
                                                <div className="space-y-3">
                                                    <label className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <FaBed className="text-green-500" />
                                                        Bedrooms
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <MuiDropdown
                                                        options={[
                                                            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
                                                                label: `${num} ${num === 1 ? "Bedroom" : "Bedrooms"}`,
                                                                value: num,
                                                            })),
                                                            { label: "10+ Bedrooms", value: 11 },
                                                        ]}
                                                        value={bedrooms}
                                                        ref={inputRefs.bedrooms}
                                                        onChange={setBedrooms}
                                                        placeholder="Select Options"
                                                        className="w-full"
                                                    />

                                                    {errors.bedrooms && (
                                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                            <FaExclamationTriangle className="text-xs" />
                                                            {errors.bedrooms}
                                                        </p>
                                                    )}

                                                </div>

                                                {/* Bathrooms */}
                                                <div className="space-y-3">
                                                    <label className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <FaBath className="text-blue-500" />
                                                        Bathrooms
                                                        <span className="text-red-500">*</span>
                                                    </label>

                                                    <MuiDropdown
                                                        options={[
                                                            { label: "0 bathrooms", value: 0 },
                                                            { label: "0.5 bathroom", value: 0.5 },
                                                            ...[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => ({
                                                                label: `${num} ${num === 1 ? "bathroom" : "bathrooms"}`,
                                                                value: num,
                                                            })),
                                                            { label: "6+ bathrooms", value: 6 },
                                                        ]}
                                                        value={bathrooms}
                                                        ref={inputRefs.bathrooms}
                                                        onChange={setBathrooms}
                                                        placeholder="Select Options"
                                                        className="w-full"
                                                    />

                                                    {errors.bathrooms && (
                                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                            <FaExclamationTriangle className="text-xs" />
                                                            {errors.bathrooms}
                                                        </p>
                                                    )}
                                                </div>

                                            </div>
                                        )
                                    }

                                    {/* Property Type Display */}
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                {React.createElement(
                                                    propertyTypes[activeTab]?.find(p => p.id === selectedProperty)?.icon || FaHome,
                                                    { className: "text-blue-600" }
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Property Type</span>
                                                <p className="font-semibold text-gray-900">
                                                    {propertyTypes[activeTab]?.find(p => p.id === selectedProperty)?.label || "Not selected"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Description */}
                                <div className="space-y-6">
                                    {/* Property Description */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-semibold text-gray-900 flex items-center gap-2">
                                                <FaHeart className="text-red-500" />
                                                What do you love about this place?
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                {description.length}/2000
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                placeholder={`Describe the unique features, recent renovations, neighborhood benefits, and what makes your property special. Mention natural light, views, storage space, and any recent upgrades...`}
                                                className={`h-40 resize-none normal_input ${errors.description ? "normal_err" : ""}`}
                                                value={description}
                                                ref={inputRefs.description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                maxLength={2000}
                                            />
                                        </div>
                                        {errors.description ? (
                                            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                                <FaExclamationTriangle className="text-xs" />
                                                {errors.description}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500">
                                                Great descriptions attract serious buyers. Be detailed and honest!
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Tips */}
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <div className="flex items-start gap-2">
                                            <FaLightbulb className="text-yellow-500 mt-0.5" />
                                            <div>
                                                <span className="font-medium text-yellow-800 text-sm">Tips for a great description:</span>
                                                <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                                                    <li>• Mention recent renovations or upgrades</li>
                                                    <li>• Highlight unique features and amenities</li>
                                                    <li>• Describe the neighborhood and nearby attractions</li>
                                                    <li>• Be honest about the property's condition</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities Section */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <FaStar className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">What amenities are available?</h3>
                                        <p className="text-gray-600 text-sm">Select all that apply (optional but recommended)</p>
                                    </div>
                                </div>

                                {/* Amenities Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {amenities.map((amenity) => {
                                        const isActive = selectedAmenities.includes(amenity.id);

                                        return (
                                            <label
                                                key={amenity.id}
                                                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer
          transition-all duration-300 ease-in-out
          ${isActive
                                                        ? "border-blue-400 bg-blue-50 shadow-sm scale-[1.02]"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedAmenities((prev) => [...prev, amenity.id]);
                                                        } else {
                                                            setSelectedAmenities((prev) => prev.filter((id) => id !== amenity.id));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <amenity.icon
                                                    className={`text-lg transition-colors duration-300 ease-in-out ${isActive ? "text-blue-600" : amenity.color
                                                        }`}
                                                />
                                                <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>

                            </div>

                            {/* Preview Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-white shadow-sm">
                                            <FaEye className="text-blue-600 text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Listing Preview</h4>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                {propertyName && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                                                        <FaSignature className="text-blue-500" />
                                                        {propertyName.length > 30 ? propertyName.substring(0, 30) + '...' : propertyName}
                                                    </span>
                                                )}
                                                {bedrooms > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                                                        <FaBed className="text-green-500" />
                                                        {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
                                                    </span>
                                                )}
                                                {bathrooms > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                                                        <FaBath className="text-blue-500" />
                                                        {bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}
                                                    </span>
                                                )}
                                                {selectedAmenities.length > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                                                        <FaStar className="text-yellow-500" />
                                                        {selectedAmenities.length} amenities
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleContinue}
                                        disabled={loading}
                                        className="relative cursor-pointer flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-[50px] hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-105 disabled:scale-100 min-w-[180px] overflow-hidden group"
                                    >
                                        {/* Animated background shine effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                        {loading ? (
                                            <>
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                    <span className="font-semibold">Processing...</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="text-lg relative z-10" />
                                                <span className="relative z-10 font-semibold">Complete Listing</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    className="flex cursor-pointer items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                                >
                                    <FaChevronLeft /> Back to Visuals
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Page;