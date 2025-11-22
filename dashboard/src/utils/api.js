// utils/api.js - Updated uploadListing function
export const uploadListing = async ({
  title,
  description,
  selectedProperty,
  activeTab,
  propertyFor,
  state,
  city,
  size, // This is a string with commas like "2,500"
  price, // This is a string with commas like "350,000"
  priceType,
  bedrooms, // This might be a string
  bathrooms, // This might be a string
  selectedAmenities,
  owner,
  agent,
  files,
  coverPhotoIndex,
}) => {
  try {
    const formData = new FormData();

    // Flat/basic fields
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("owner", owner);
    formData.append("agent", agent || "");
    formData.append("propertyFor", propertyFor);

    // Send as individual fields instead of JSON strings
    formData.append("propertyType[category]", activeTab || "Residential");
    formData.append("propertyType[subType]", selectedProperty);

    // Location as individual fields
    formData.append("location[state]", state);
    formData.append("location[city]", city);
    
    // Price as individual fields - CONVERT TO NUMBERS
    const numericPrice = parseInt(price.replace(/,/g, ""), 10) || 0;
    formData.append("price[amount]", numericPrice.toString()); // Keep as string but without commas
    
    formData.append("price[currency]", "USD");
    formData.append("price[priceType]", priceType || "fixed");

    // Details as individual fields - CONVERT TO NUMBERS
    const numericSize = parseInt(size.replace(/,/g, ""), 10) || 0;
    formData.append("details[size]", numericSize.toString()); // Convert "2,500" to "2500"
    
    if (bedrooms) {
      const numericBedrooms = parseInt(bedrooms, 10) || 0;
      formData.append("details[bedrooms]", numericBedrooms.toString());
    }
    
    if (bathrooms) {
      const numericBathrooms = parseInt(bathrooms, 10) || 0;
      formData.append("details[bathrooms]", numericBathrooms.toString());
    }

    // Amenities as multiple fields
    if (selectedAmenities && selectedAmenities.length > 0) {
      selectedAmenities.forEach(amenity => {
        formData.append("amenities[]", amenity);
      });
    }

    // Media files
    files.forEach((file, index) => {
      formData.append("files", file);
    });
    
    // Add cover photo index separately
    if (coverPhotoIndex !== undefined) {
      formData.append("coverPhotoIndex", coverPhotoIndex.toString());
    }

    // Debug
    console.log("FormData contents:");
    for (let [key, val] of formData.entries()) {
      console.log(key, val, typeof val);
    }

    // Request
    const res = await fetch("http://localhost:3001/api/listings/create", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Server errors:", data.errors);
      throw new Error(data.message || "Failed to upload listing");
    }

    return {
      success: true,
      message: "Listing uploaded successfully",
      listing: data.data,
    };
  } catch (error) {
    console.error("Upload listing error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
};

export const getListing = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/api/dashboard/getListing/${id}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
};
export const updateListing = async (id, formData) => {
    try {
        const response = await fetch(`http://localhost:3001/api/update/${id}`, {
            method: 'POST',
            credentials: "include",
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
    }
};
