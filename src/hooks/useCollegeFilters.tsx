
import { useState, useMemo } from "react";
import { FilterOptions } from "@/components/FilterModal";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

export const useCollegeFilters = (colleges: College[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    state: "All States",
    district: "All Districts",
    gender: "all",
    collegeType: "All Types",
    showTopColleges: false,
    locationBased: false
  });

  const filteredColleges = useMemo(() => {
    let filtered = [...colleges];

    // State filter
    if (filters.state !== "All States") {
      filtered = filtered.filter(college => 
        college.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // District/City filter
    if (filters.district !== "All Districts") {
      filtered = filtered.filter(college => 
        college.city.toLowerCase().includes(filters.district.toLowerCase()) ||
        college.location.toLowerCase().includes(filters.district.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender !== "all") {
      filtered = filtered.filter(college => {
        const collegeName = college.name.toLowerCase();
        const collegeType = college.type.toLowerCase();
        
        if (filters.gender === "women") {
          return collegeName.includes("women") || 
                 collegeName.includes("girls") || 
                 collegeType.includes("women") ||
                 collegeName.includes("mahila");
        } else if (filters.gender === "men") {
          return collegeName.includes("men") || 
                 collegeName.includes("boys") || 
                 collegeType.includes("men");
        }
        return true;
      });
    }

    // College type filter
    if (filters.collegeType !== "All Types") {
      filtered = filtered.filter(college => {
        const collegeType = college.type.toLowerCase();
        const filterType = filters.collegeType.toLowerCase();
        
        switch (filterType) {
          case 'government':
            return collegeType.includes('government') || 
                   collegeType.includes('public') ||
                   collegeType.includes('state') ||
                   collegeType.includes('central') ||
                   collegeType.includes('national');
          case 'private':
            return collegeType.includes('private') || 
                   collegeType.includes('deemed') ||
                   collegeType.includes('autonomous');
          case 'university':
            return collegeType.includes('university');
          case 'engineering':
            return collegeType.includes('engineering') || collegeType.includes('technology');
          case 'medical':
            return collegeType.includes('medical') || collegeType.includes('health');
          case 'arts & science':
            return collegeType.includes('arts') || collegeType.includes('science');
          case 'management':
            return collegeType.includes('management') || collegeType.includes('business');
          case 'law':
            return collegeType.includes('law');
          case 'pharmacy':
            return collegeType.includes('pharmacy');
          case 'agriculture':
            return collegeType.includes('agriculture') || collegeType.includes('agricultural');
          case 'polytechnic':
            return collegeType.includes('polytechnic');
          default:
            return collegeType.includes(filterType);
        }
      });
    }

    // Top colleges filter (based on rating)
    if (filters.showTopColleges) {
      filtered = filtered.filter(college => college.rating && college.rating >= 4.0);
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Location-based filter (if user location is available)
    if (filters.locationBased && filters.userLocation) {
      // This would require more complex geolocation logic
      // For now, we'll just prioritize colleges with better ratings
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [colleges, filters]);

  return {
    filters,
    setFilters,
    filteredColleges
  };
};
