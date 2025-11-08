import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NoListings() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state"); // Keep the state param

  // Build a URL for clearing filters but keeping state
  const clearFiltersUrl = state ? `/results?state=${state}` : "/results";

   return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Try adjusting your filters or search criteria to find more properties.
        </p>
        <Link
          href={clearFiltersUrl}
          className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Clear All Filters
        </Link>
      </div>
    );

  return null;
}
