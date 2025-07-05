
import { useState, useCallback } from 'react';
import { Database } from '@/integrations/supabase/types';
import { FilterOptions } from '@/components/FilterModal';

type College = Database['public']['Tables']['colleges']['Row'];

export const useCollegeFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    state: 'all',
    district: 'all',
    gender: 'all',
    collegeType: 'all',
    topColleges: false,
    locationBased: false
  });

  const applyFilters = useCallback((colleges: College[], appliedFilters: FilterOptions = filters): College[] => {
    let filtered = [...colleges];

    // State filter
    if (appliedFilters.state && appliedFilters.state !== 'all') {
      filtered = filtered.filter(college => 
        college.state?.toLowerCase() === appliedFilters.state.toLowerCase()
      );
    }

    // District filter (check both city and location)
    if (appliedFilters.district && appliedFilters.district !== 'all') {
      filtered = filtered.filter(college => 
        college.city?.toLowerCase().includes(appliedFilters.district.toLowerCase()) ||
        college.location?.toLowerCase().includes(appliedFilters.district.toLowerCase())
      );
    }

    // Gender filter
    if (appliedFilters.gender && appliedFilters.gender !== 'all') {
      filtered = filtered.filter(college => {
        const collegeName = college.name?.toLowerCase() || '';
        const collegeType = college.type?.toLowerCase() || '';
        
        if (appliedFilters.gender === 'women') {
          return collegeName.includes('women') || 
                 collegeName.includes('girls') || 
                 collegeType.includes('women') ||
                 collegeName.includes('mahila');
        } else if (appliedFilters.gender === 'men') {
          return collegeName.includes('men') || 
                 collegeName.includes('boys') || 
                 collegeType.includes('men');
        }
        return true;
      });
    }

    // College type filter
    if (appliedFilters.collegeType && appliedFilters.collegeType !== 'all') {
      filtered = filtered.filter(college => {
        const collegeType = college.type?.toLowerCase() || '';
        const filterType = appliedFilters.collegeType.toLowerCase();
        
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
            return collegeType.includes('engineering') || 
                   collegeType.includes('technology') ||
                   collegeType.includes('technical');
          case 'medical':
            return collegeType.includes('medical') || 
                   collegeType.includes('medicine') ||
                   collegeType.includes('health');
          case 'management':
            return collegeType.includes('management') || 
                   collegeType.includes('business') ||
                   collegeType.includes('mba');
          default:
            return collegeType.includes(filterType);
        }
      });
    }

    // Top colleges filter (based on rating)
    if (appliedFilters.topColleges) {
      filtered = filtered.filter(college => 
        (college.rating || 0) >= 4.0
      ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [filters]);

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      state: 'all',
      district: 'all',
      gender: 'all',
      collegeType: 'all',
      topColleges: false,
      locationBased: false
    });
  }, []);

  return {
    filters,
    applyFilters,
    updateFilters,
    clearFilters
  };
};
