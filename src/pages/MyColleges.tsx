
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import MyCollegesList from "@/components/MyCollegesList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function MyColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyColleges();
  }, []);

  async function fetchMyColleges() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in.");
        navigate("/login");
        return;
      }
      // fetch user_selected_colleges joined with colleges table
      const { data, error } = await supabase
        .from("user_selected_colleges")
        .select(`
          id, college_id, colleges:college_id(
            id, name, location, type, state, city, rating, total_fees_min, placement_percentage, image_url
          )
        `)
        .eq("user_id", user.id);
      if (error) throw error;
      const plainColleges = (data || [])
        .map((row: any) => row.colleges)
        .filter(Boolean)
        .map((college: any) => ({ ...college, isBest: false })); // we'll mark best later
      setColleges(plainColleges);
      setSelected(plainColleges.map((c: any) => c.id)); // select all by default
    } catch (e) {
      toast.error("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  }

  // Derived: sorted/filtered colleges
  const displayedColleges = [...colleges]
    .filter((c) => filterType === "all" || c.type?.toLowerCase().includes(filterType))
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "fees") return (a.total_fees_min || 0) - (b.total_fees_min || 0);
      if (sortBy === "placement") return (b.placement_percentage || 0) - (a.placement_percentage || 0);
      return 0;
    });

  // "Best predictions": highlight colleges with rating >= 4.5 (can adjust logic)
  useEffect(() => {
    setColleges(colleges.map((c) => ({
      ...c, isBest: (c.rating || 0) >= 4.5
    })));
  }, [colleges.length]);

  const handleToggleSelect = (id: number) => {
    setSelected((curr) =>
      curr.includes(id)
        ? curr.filter((c) => c !== id)
        : [...curr, id]
    );
  };

  // PDF Generation
  const handleExportPDF = async () => {
    if (!selected.length) {
      toast.error("Select at least one college to export PDF.");
      return;
    }
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const chosen = displayedColleges.filter((c) => selected.includes(c.id));

    let y = 10;
    doc.setFontSize(18);
    doc.text("Your Selected Colleges", 10, y);
    y += 10;

    chosen.forEach((c: any, idx: number) => {
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${c.name}`, 10, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(`Location: ${c.location}, ${c.state}`, 12, y);
      y += 5;
      doc.text(`Type: ${c.type}  |  Rating: ${c.rating || "N/A"}/5.0 | Placement: ${c.placement_percentage || "NA"}%`, 12, y);
      y += 5;
      doc.text(`Fees (min): ₹${c.total_fees_min ? (c.total_fees_min / 100000).toFixed(1) : '0'}L`, 12, y);
      if (c.isBest) {
        doc.setTextColor(0,140,0);
        doc.text("⭐ Predicted as one of the best!", 12, y + 5);
        doc.setTextColor(0,0,0);
        y += 6;
      }
      y += 7;
      if (y > 260) { doc.addPage(); y = 10; }
    });

    doc.save("MyColleges.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-2">
      <h1 className="text-2xl font-bold mb-4">My Colleges</h1>
      <div className="flex gap-2 mb-4">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border px-3 py-1 rounded text-sm">
          <option value="all">All Types</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
          <option value="university">University</option>
          <option value="engineering">Engineering</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="border px-3 py-1 rounded text-sm">
          <option value="rating">Sort by Rating</option>
          <option value="fees">Sort by Fees</option>
          <option value="placement">Sort by Placement %</option>
        </select>
        <Button onClick={handleExportPDF} size="sm" className="ml-auto bg-blue-600 text-white"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
      </div>
      <MyCollegesList
        colleges={displayedColleges}
        selected={selected}
        onToggleSelect={handleToggleSelect}
      />
      {loading && <div>Loading...</div>}
    </div>
  );
}
