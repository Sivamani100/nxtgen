
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  applied: "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  accepted: "bg-green-200 text-green-900 font-bold",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationTracker() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [type]);

  async function fetchApplications() {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    let query = supabase.from("application_tracker").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (type !== "all") query = query.eq("type", type);

    const { data, error } = await query;
    if (error) toast.error("Failed to fetch applications");
    setApps(data || []);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 text-purple-700">My Applications</h1>
      <div className="flex gap-2 mb-4">
        <Button variant={type === "all" ? "default" : "outline"} onClick={() => setType("all")}>All</Button>
        <Button variant={type === "college" ? "default" : "outline"} onClick={() => setType("college")}>College</Button>
        <Button variant={type === "scholarship" ? "default" : "outline"} onClick={() => setType("scholarship")}>Scholarship</Button>
      </div>

      {loading ? <div>Loading...</div> : apps.length === 0 ? (
        <Card className="p-5 text-center text-muted-foreground">
          No applications tracked yet.
        </Card>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <Card key={app.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <div className="font-medium capitalize">{app.type} Application</div>
                  <div className="text-xs text-gray-500">{app.target_id}</div>
                  {app.notes && <div className="text-xs mt-2">{app.notes}</div>}
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[app.status] || "bg-gray-200"}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
