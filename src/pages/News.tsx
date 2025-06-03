
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Newspaper, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  published_at: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching news:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock news articles if none exist
  const mockArticles = [
    {
      id: 1,
      title: "Educational Policy Updates for 2025",
      content: "The Ministry of Education has announced significant changes to the admission process for higher education institutions. These changes aim to make the process more transparent and accessible to students from all backgrounds.",
      published_at: "2025-06-03T10:00:00Z"
    },
    {
      id: 2,
      title: "New Engineering Colleges to Open in Andhra Pradesh",
      content: "The state government has approved the establishment of five new engineering colleges across Andhra Pradesh to meet the growing demand for technical education in the region.",
      published_at: "2025-06-02T15:30:00Z"
    },
    {
      id: 3,
      title: "Scholarship Opportunities for Meritorious Students",
      content: "Various organizations have announced new scholarship programs for students pursuing higher education. These scholarships cover tuition fees, accommodation, and other educational expenses.",
      published_at: "2025-06-01T09:15:00Z"
    }
  ];

  const displayArticles = articles.length > 0 ? articles : mockArticles;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">The Courier-Journal</h1>
            <p className="text-sm text-gray-600">of Education</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Newspaper className="w-16 h-16 text-green-600 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-800">Latest Educational News</h2>
              <p className="text-gray-600">Stay updated with the latest in education</p>
            </div>

            {displayArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-green-500 relative">
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <Newspaper className="w-12 h-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">Educational News</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <User className="w-4 h-4 mr-1" />
                    <span>NXTGEN Editor</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {article.content}
                  </p>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    Read Full Article
                  </Button>
                </div>
              </Card>
            ))}

            {displayArticles.length === 0 && !loading && (
              <div className="text-center py-8">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500 mb-2">No news articles available</div>
                <div className="text-sm text-gray-400">
                  Check back later for the latest educational news
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
