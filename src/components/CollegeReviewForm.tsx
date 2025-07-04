
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface CollegeReviewFormProps {
  collegeId: number;
  collegeName: string;
  onReviewSubmitted?: () => void;
}

const CollegeReviewForm = ({ collegeId, collegeName, onReviewSubmitted }: CollegeReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5!");
      setSubmitting(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (userError || !user) {
        toast.error("You must be logged in to submit a review.");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("college_reviews").insert([
        {
          college_id: collegeId,
          user_id: user.id,
          rating: rating,
          review: review,
        }
      ]);

      if (error) {
        console.error("Supabase error details:", error);
        toast.error("Failed to submit review.");
      } else {
        toast.success("Review submitted successfully!");
        setRating(0);
        setReview("");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Write a Review for {collegeName}</h3>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Review (Optional)</label>
          <Input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this college..."
            disabled={submitting}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={submitting || rating === 0}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Card>
  );
};

export default CollegeReviewForm;
