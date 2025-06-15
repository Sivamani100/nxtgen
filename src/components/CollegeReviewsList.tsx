
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CollegeReviewsListProps {
  collegeId: number;
  limit?: number;
}

export function CollegeReviewsList({ collegeId, limit }: CollegeReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      let query = supabase
        .from("college_reviews")
        .select("*")
        .eq("college_id", collegeId)
        .order("created_at", { ascending: false });
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      setReviews(data || []);
      setLoading(false);
    }
    fetchReviews();
  }, [collegeId, limit]);

  if (loading) return <div className="text-gray-500 py-2">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-xs text-muted-foreground mb-2">No reviews yet.</div>;
  return (
    <ul className="space-y-2">
      {reviews.map(rev => (
        <li key={rev.id} className="bg-orange-50 border rounded p-2">
          <span className="font-semibold">{rev.rating} ⭐</span>
          <span className="ml-3">{rev.review}</span>
        </li>
      ))}
    </ul>
  );
}
