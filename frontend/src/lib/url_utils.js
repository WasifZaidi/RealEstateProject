export function generatePageUrl(page, searchParams) {
  const params = new URLSearchParams(
    typeof searchParams === "string" 
      ? searchParams 
      : Object.fromEntries(searchParams?.entries?.() || [])
  );
  params.set("page", page.toString());
  return `/results?${params.toString()}`;
}

// Helper for generating canonical URLs
export function generateCanonicalUrl(searchParams, path = '/results') {
  const params = new URLSearchParams(
    Object.fromEntries(searchParams?.entries?.() || [])
  );
  
  // Remove page parameter for canonical URL if it's page 1
  if (params.get('page') === '1') {
    params.delete('page');
  }
  
  const queryString = params.toString();
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}${
    queryString ? `?${queryString}` : ''
  }`;
}