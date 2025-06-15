
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CollegeReviews() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  async function fetchColleges() {
    setLoading(true);
    const { data, error } = await supabase.from("colleges").select("id,name,city,state");
    if (error) {
      toast.error("Failed to load colleges");
    } else {
      setColleges(data || []);
    }
    setLoading(false);
  }

  async function fetchReviews(cid: number) {
    setLoading(true);
    setSelectedCollege(colleges.find(c => c.id === cid));
    const { data, error } = await supabase.from("college_reviews").select("*").eq("college_id", cid).order("created_at", { ascending: false });
    if (!error) setReviews(data || []);
    else toast.error("Error loading reviews");
    setLoading(false);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Fetch the user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      toast.error("You must be logged in to submit a review.");
      setSubmitting(false);
      return;
    }
    if (!myRating) {
      toast.error("Pick a rating!");
      setSubmitting(false);
      return;
    }

    // Try to submit review
    const { error } = await supabase.from("college_reviews").insert({
      college_id: selectedCollege.id,
      user_id: user.id,
      rating: myRating,
      review: myReview,
    });

    if (error) {
      toast.error(
        <>
          <div>Failed to submit review.</div>
          <div className="text-xs text-red-500">{error.message || JSON.stringify(error)}</div>
        </>
      );
    } else {
      toast.success("Review posted!");
      setMyRating(0);
      setMyReview("");
      fetchReviews(selectedCollege.id);
    }
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4 min-h-[500px]">
      {/* College List Sidebar */}
      <div className="md:min-w-[260px] md:max-w-xs md:w-1/3">
        <Card className="p-3 sticky top-20">
          <div className="font-semibold mb-2 text-green-700">Colleges</div>
          <ul className="space-y-1 max-h-[480px] overflow-auto">
            {colleges.map(college => (
              <li key={college.id}>
                <Button
                  variant={selectedCollege?.id === college.id ? "default" : "secondary"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fetchReviews(college.id)}
                >
                  <div className="truncate">{college.name} <span className="text-xs text-gray-400">({college.city}, {college.state})</span></div>
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {!selectedCollege ? (
          <Card className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="text-lg text-green-800 font-bold mb-2">College Reviews & Ratings</div>
            <div className="text-gray-500 text-sm">Select a college on the left to view/add reviews.</div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <h2 className="font-bold text-xl mb-1">{selectedCollege.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedCollege(null)} size="sm">← Change College</Button>
            </div>
            <div className="mb-3 text-xs text-gray-500">{selectedCollege.city}, {selectedCollege.state}</div>
            <form onSubmit={handleSubmitReview} className="flex flex-col md:flex-row gap-2 mb-5">
              <select
                className="rounded border px-2 py-1"
                value={myRating}
                onChange={e => setMyRating(Number(e.target.value))}
                required
                disabled={submitting}
              >
                <option value={0}>Rate</option>
                {[1, 2, 3, 4, 5].map(r => (
                  <option key={r} value={r}>{r} ⭐</option>
                ))}
              </select>
              <Input
                placeholder="Write a short review (optional)"
                value={myReview}
                onChange={e => setMyReview(e.target.value)}
                disabled={submitting}
              />
              <Button type="submit" size="sm" disabled={submitting}>Submit</Button>
            </form>
            <div className="font-medium mb-2">Recent Reviews:</div>
            <div>
              {loading && <div className="text-gray-500 py-2">Loading...</div>}
              {!loading && (
                <ul className="space-y-2">
                  {reviews.length === 0 && <div className="text-xs text-muted-foreground mb-2">No reviews yet.</div>}
                  {reviews.map(rev => (
                    <li key={rev.id} className="bg-orange-50 border rounded p-2">
                      <span className="font-semibold">{rev.rating} ⭐</span>
                      <span className="ml-3">{rev.review}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
