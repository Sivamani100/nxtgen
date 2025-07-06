
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const HomeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">Find Your Perfect College</h2>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg border-0 bg-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <Button type="submit" className="h-12 px-6 bg-white text-blue-600 hover:bg-gray-100">
          Search
        </Button>
      </form>
    </div>
  );
};

export default HomeSearch;
