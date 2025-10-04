
// utils/api.js (or inside your component if preferred)
export const uploadListing = async ({
  title,
  description,
  selectedProperty,
  activeTab,
  state,
  city,
  size,
  price,
  bedrooms,
  bathrooms,
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
    formData.append("description", description);
    formData.append("owner", owner);
    if (agent) formData.append("agent", agent);

    // Send structured data as JSON
    formData.append(
      "propertyType",
      JSON.stringify({
        category: activeTab || "Residential",
        subType: selectedProperty,
      })
    );

    formData.append(
      "location",
      JSON.stringify({
        state,
        city,
      })
    );

    const numericPrice = parseInt(price.replace(/,/g, ""), 10) || 0;
    formData.append(
      "price",
      JSON.stringify({
        amount: numericPrice,
        currency: "USD",
        priceType: "fixed",
      })
    );

    formData.append(
      "details",
      JSON.stringify({
        size,
        bedrooms,
        bathrooms,
      })
    );

    formData.append("amenities", JSON.stringify(selectedAmenities));

    // Media files
    files.forEach((file, index) => {
      formData.append("files", file);
      if (index === coverPhotoIndex) {
        formData.append("coverPhotoIndex", index);
      }
    });

    // Debug
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // Request
    const res = await fetch("http://localhost:3001/api/listings/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to upload listing");
    }

    return {
      success: true,
      message: "Listing uploaded successfully",
      listing: data.listing,
    };
  } catch (error) {
    console.error("Upload listing error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
};

