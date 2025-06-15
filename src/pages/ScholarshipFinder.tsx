
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ScholarshipFinder() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScholarships();
  }, []);

  async function getScholarships() {
    setLoading(true);
    const { data, error } = await supabase.from("scholarships").select("*").order("deadline", { ascending: true });
    if (error) {
      toast.error("Failed to fetch scholarships");
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 text-blue-800">Find Scholarships</h1>
      {loading ? (
        <div>Loading...</div>
      ) : scholarships.length === 0 ? (
        <Card className="p-5 text-center text-muted-foreground">
          No scholarships currently available.
        </Card>
      ) : (
        <div className="space-y-5">
          {scholarships.map((sch) => (
            <Card key={sch.id} className="p-5">
              <div className="font-semibold text-lg mb-1">{sch.title}</div>
              {sch.amount && (
                <div className="text-green-600">Amount: ₹{sch.amount.toLocaleString()}</div>
              )}
              {sch.deadline && (
                <div className="text-xs text-red-600 mb-1">Deadline: {sch.deadline}</div>
              )}
              {sch.eligible_courses && (
                <div className="text-xs text-gray-500 mb-1">
                  Eligible for: {sch.eligible_courses.join(", ")}
                </div>
              )}
              <div className="mb-2">{sch.description}</div>
              {sch.application_link && (
                <Button
                  className="mt-2"
                  variant="secondary"
                  size="sm"
                  asChild
                >
                  <a href={sch.application_link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
