
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search as SearchIcon, Filter, Heart, Share, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Resource {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  details: any;
  created_at: string;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query, category, sortBy]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('resources')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.ilike('title', `%${query}%`);
      }

      if (category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (sortBy === 'newest') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        queryBuilder = queryBuilder.order('created_at', { ascending: true });
      }

      const { data, error } = await queryBuilder.limit(20);

      if (error) {
        toast.error("Error searching resources");
        console.error('Search error:', error);
        return;
      }

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResource = async (resourceId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to save resources");
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          resource_id: resourceId
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("Resource already saved");
        } else {
          toast.error("Error saving resource");
        }
        return;
      }

      toast.success("Resource saved to favorites");
    } catch (error) {
      console.error('Save error:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleShare = (resource: Resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${resource.title} - ${window.location.href}`);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b p-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Scholarship">Scholarships</SelectItem>
                <SelectItem value="Admission">Admissions</SelectItem>
                <SelectItem value="Event">Events</SelectItem>
                <SelectItem value="News">News</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {results.length} results found
            </div>
            {results.map((resource) => (
              <Card key={resource.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-2">
                      {resource.category}
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(resource.date || resource.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSaveResource(resource.id)}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShare(resource)}
                  >
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">No results found</div>
            <div className="text-sm text-gray-400">
              Try different keywords or check the spelling
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
