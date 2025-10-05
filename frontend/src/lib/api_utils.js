/**
 * Safely converts search params to URLSearchParams
 * Handles arrays, objects, and primitive values
 */
export function buildSearchParams(params) {
  const searchParams = new URLSearchParams();
  
  if (!params || typeof params !== 'object') {
    return searchParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined, null, and empty strings
    if (value === undefined || value === null || value === '') {
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== undefined && item !== null && item !== '') {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    // Handle objects - convert to JSON string if needed
    if (typeof value === 'object') {
      try {
        searchParams.append(key, JSON.stringify(value));
      } catch {
        // If serialization fails, skip
        return;
      }
      return;
    }

    // Handle primitive values
    searchParams.append(key, String(value));
  });

  return searchParams;
}

/**
 * Enhanced fetch function for listings with better error handling
 */
export async function fetchListings(searchParams) {
  const params = buildSearchParams(searchParams);
  const queryString = params.toString();
  
  // Add default parameters if needed
  if (!searchParams.page) {
    params.set('page', '1');
  }
  if (!searchParams.limit) {
    params.set('limit', '20');
  }

  const apiUrl = `http://localhost:3001/api/listings/results/filters?${params.toString()}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      next: { 
        revalidate: 300,
        tags: ['listings'] 
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 404) {
        throw new Error('Listings not found');
      } else if (response.status === 500) {
        throw new Error('Server error occurred');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching listings:', {
      error: error.message,
      url: apiUrl,
      params: searchParams,
      timestamp: new Date().toISOString()
    });

    // Return structured error response
    return { 
      success: false, 
      data: { 
        listings: [], 
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 20
        }, 
        metadata: {
          featuredCount: 0,
          returnedCount: 0
        }
      },
      message: error.name === 'AbortError' ? 'Request timeout' : 'Failed to fetch listings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}