
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, MapPin, Star, Eye, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedColleges, setSavedColleges] = useState([
    {
      id: 1,
      name: "IIT Bombay",
      location: "Visakhapatnam",
      rating: 4.5,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "IIT Bombay",
      location: "Visakhapatnam", 
      rating: 4.5,
      image: "/placeholder.svg"
    }
  ]);
  const navigate = useNavigate();

  const handleRemoveCollege = (id: number) => {
    setSavedColleges(prev => prev.filter(college => college.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Colleges</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Profile Section */}
        <Card className="p-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <h3 className="font-semibold text-gray-800">Bheem shankar</h3>
            <p className="text-sm text-gray-600">mallipurapusiva@gmail.com</p>
            <Button className="mt-3 bg-green-600 hover:bg-green-700">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Profile Completion */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Profile Completion</h4>
            <span className="text-green-600 font-semibold">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-gray-600">
            Complete your profile to get better college recommendations on you need
          </p>
        </Card>

        {/* Saved Colleges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Saved Colleges</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {savedColleges.map((college) => (
              <Card key={college.id} className="flex-shrink-0 w-48 p-3">
                <div className="h-24 bg-gradient-to-br from-blue-400 to-green-600 rounded mb-2 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 p-1 h-auto text-white hover:bg-white/20"
                    onClick={() => handleRemoveCollege(college.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h4 className="font-medium text-sm">{college.name}</h4>
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {college.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs">{college.rating}</span>
                  </div>
                  <Button size="sm" className="text-xs h-6 bg-green-600 hover:bg-green-700">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Recent Searches</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">Clear All</Button>
          </div>
          <div className="space-y-2">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Computer Science colleges in Vizag</h4>
                  <p className="text-xs text-gray-600">May 25, 2025 • 10:23 AM</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Engineering colleges with low fees</h4>
                  <p className="text-xs text-gray-600">May 25, 2025 • 10:30 AM</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Top colleges in AP</h4>
                  <p className="text-xs text-gray-600">May 25, 2025 • 11:13 AM</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* My Preferences */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">My Preferences</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">Edit</Button>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Courses</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">B-Tech</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">BE</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Branches</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Computer science</span>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Electronics</span>
                <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded">Mechanical</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Locations</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Visakhapatnam</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Rajamundry</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Budget</h4>
              <p className="text-sm text-gray-600">$40,000 - $ 80,000 per year</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Colleges;
