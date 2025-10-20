import { FaHome, FaVideo, FaUmbrellaBeach, FaFire, FaSwimmingPool, FaUtensils, FaSoap, FaMicrophone, FaSnowflake, FaThermometerHalf, FaTshirt, FaShieldAlt, FaLock, FaCar, FaWarehouse, FaChair, FaCouch, FaPaw, FaWheelchair, FaWifi, FaSeedling} from "react-icons/fa";
export const amenities = [
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