
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
    const user = (await supabase.auth.getUser()).data.user;
    if (!myRating) {
      toast.error("Pick a rating!");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("college_reviews").insert({
      college_id: selectedCollege.id,
      user_id: user.id,
      rating: myRating,
      review: myReview,
    });
    if (error) toast.error("Failed to submit review.");
    else {
      toast.success("Review posted!");
      setMyRating(0); setMyReview("");
      fetchReviews(selectedCollege.id);
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-5 text-orange-700">College Reviews & Ratings</h1>
      {!selectedCollege ? (
        <Card className="p-4">
          <div>Select a college to view/add reviews:</div>
          <ul className="mt-2 space-y-1">
            {colleges.map(college => (
              <li key={college.id}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fetchReviews(college.id)}
                >
                  {college.name} ({college.city}, {college.state})
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="p-4">
          <Button variant="ghost" onClick={() => setSelectedCollege(null)} className="mb-3">← Back</Button>
          <h2 className="font-bold text-xl mb-1">{selectedCollege.name}</h2>
          <div className="mb-3 text-xs text-gray-500">{selectedCollege.city}, {selectedCollege.state}</div>
          <div>
            <form onSubmit={handleSubmitReview} className="flex flex-col md:flex-row gap-2 mb-2">
              <select
                className="rounded border px-2 py-1"
                value={myRating}
                onChange={e => setMyRating(Number(e.target.value))}
                required
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
          </div>
          <div>
            <div className="font-medium mb-2">Recent Reviews:</div>
            {reviews.length === 0 && <div className="text-xs text-muted-foreground mb-2">No reviews yet.</div>}
            <ul className="space-y-2">
              {reviews.map(rev => (
                <li key={rev.id} className="bg-orange-50 border rounded p-2">
                  <span className="font-semibold">{rev.rating} ⭐</span>
                  <span className="ml-3">{rev.review}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
