
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  state: string;
  district: string;
  gender: string; // 'all', 'women', 'men'
  collegeType: string; // 'all', 'government', 'private', 'university', 'engineering', 'medical'
  topColleges: boolean;
  locationBased: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

const STATE_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Nellore', 'Kurnool'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Rangareddy', 'Medak'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha', 'Kollam', 'Palakkad', 'Kannur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Hoshiarpur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi']
};

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (filters.state && filters.state !== 'all') {
      setAvailableDistricts(STATE_DISTRICTS[filters.state] || []);
    } else {
      setAvailableDistricts([]);
      setFilters(prev => ({ ...prev, district: 'all' }));
    }
  }, [filters.state]);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      state: 'all',
      district: 'all',
      gender: 'all',
      collegeType: 'all',
      topColleges: false,
      locationBased: false
    };
    setFilters(clearedFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filter Colleges
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* State Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">State</Label>
            <Select 
              value={filters.state} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">District</Label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
              disabled={!availableDistricts.length}
            >
              <SelectTrigger>
                <SelectValue placeholder={availableDistricts.length ? "Select District" : "Select State First"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gender Specific</Label>
            <Select 
              value={filters.gender} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                <SelectItem value="women">Women's Colleges</SelectItem>
                <SelectItem value="men">Men's Colleges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* College Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">College Type</Label>
            <Select 
              value={filters.collegeType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, collegeType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top Colleges Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="topColleges"
              checked={filters.topColleges}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, topColleges: !!checked }))}
            />
            <Label htmlFor="topColleges" className="text-sm font-medium">
              Top Colleges Only
            </Label>
          </div>

          {/* Location Based Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="locationBased"
              checked={filters.locationBased}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, locationBased: !!checked }))}
            />
            <Label htmlFor="locationBased" className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Show Nearby Colleges
            </Label>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Clear All
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
