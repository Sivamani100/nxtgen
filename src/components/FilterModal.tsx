
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X, MapPin } from "lucide-react";
import { toast } from "sonner";

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  state: string;
  district: string;
  gender: string; // 'all', 'women', 'men'
  collegeType: string;
  showTopColleges: boolean;
  locationBased: boolean;
  userLocation?: { lat: number; lng: number };
}

const INDIAN_STATES = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const STATE_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["All Districts", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Anantapur", "Kadapa"],
  "Telangana": ["All Districts", "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar", "Nalgonda", "Adilabad", "Medak"],
  "Karnataka": ["All Districts", "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur"],
  "Tamil Nadu": ["All Districts", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi"],
  "Maharashtra": ["All Districts", "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"],
  "Kerala": ["All Districts", "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kottayam", "Kannur"],
  "Gujarat": ["All Districts", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand"],
  "Rajasthan": ["All Districts", "Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara", "Alwar", "Bharatpur"],
  "Uttar Pradesh": ["All Districts", "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh"],
  "West Bengal": ["All Districts", "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur", "Haldia"]
};

const COLLEGE_TYPES = [
  "All Types", "Government", "Private", "University", "Engineering", "Medical", 
  "Arts & Science", "Management", "Law", "Pharmacy", "Agriculture", "Polytechnic"
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onOpenChange, onFiltersApply, currentFilters }) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (filters.state && filters.state !== "All States") {
      setAvailableDistricts(STATE_DISTRICTS[filters.state] || []);
      setFilters(prev => ({ ...prev, district: "All Districts" }));
    } else {
      setAvailableDistricts([]);
      setFilters(prev => ({ ...prev, district: "All Districts" }));
    }
  }, [filters.state]);

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prev => ({
            ...prev,
            locationBased: true,
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast.success("Location access granted!");
        },
        (error) => {
          toast.error("Could not access location. Please enable location services.");
          setFilters(prev => ({ ...prev, locationBased: false }));
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleApplyFilters = () => {
    onFiltersApply(filters);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      state: "All States",
      district: "All Districts",
      gender: "all",
      collegeType: "All Types",
      showTopColleges: false,
      locationBased: false
    };
    setFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.state !== "All States") count++;
    if (filters.district !== "All Districts") count++;
    if (filters.gender !== "all") count++;
    if (filters.collegeType !== "All Types") count++;
    if (filters.showTopColleges) count++;
    if (filters.locationBased) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filter Colleges</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* State Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
              disabled={!availableDistricts.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">College Type by Gender</label>
            <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                <SelectItem value="women">Women's Colleges</SelectItem>
                <SelectItem value="men">Men's Colleges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* College Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Institution Type</label>
            <Select value={filters.collegeType} onValueChange={(value) => setFilters(prev => ({ ...prev, collegeType: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select College Type" />
              </SelectTrigger>
              <SelectContent>
                {COLLEGE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Top Colleges Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Top Colleges Only</label>
            <Button
              variant={filters.showTopColleges ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, showTopColleges: !prev.showTopColleges }))}
            >
              {filters.showTopColleges ? "Enabled" : "Disabled"}
            </Button>
          </div>

          {/* Location Based Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Near My Location</label>
            <Button
              variant={filters.locationBased ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (!filters.locationBased) {
                  handleLocationAccess();
                } else {
                  setFilters(prev => ({ ...prev, locationBased: false, userLocation: undefined }));
                }
              }}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {filters.locationBased ? "Enabled" : "Enable"}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleResetFilters} className="flex-1">
            Reset All
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
