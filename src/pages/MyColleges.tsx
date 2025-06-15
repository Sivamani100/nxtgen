
import { useEffect, useState } from "react";
import { useUserSelectedColleges } from "@/hooks/useUserSelectedColleges";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import jsPDF from "jspdf";
import { Star, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

export default function MyColleges() {
  const { selectedCollegeIds, removeCollege, loading, refetch } = useUserSelectedColleges();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filtered, setFiltered] = useState<College[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // Fetch all my selected colleges
    const fetchColleges = async () => {
      if (selectedCollegeIds.length === 0) {
        setColleges([]);
        setFiltered([]);
        return;
      }
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .in("id", selectedCollegeIds);

      setColleges(data ?? []);
      setFiltered(data ?? []);
    };
    fetchColleges();
  }, [selectedCollegeIds]);

  useEffect(() => {
    let filteredList = colleges;
    if (search.trim().length > 0) {
      filteredList = filteredList.filter(c =>
        (c.name?.toLowerCase() ?? "").includes(search.toLowerCase())
        || (c.location?.toLowerCase() ?? "").includes(search.toLowerCase())
        || (c.state?.toLowerCase() ?? "").includes(search.toLowerCase())
      );
    }
    // "Prediction": sort by rating (as "best")
    filteredList = [...filteredList].sort((a, b) => {
      switch (sortBy) {
        case "fees_low": return (a.total_fees_min || 0) - (b.total_fees_min || 0);
        case "fees_high": return (b.total_fees_max || 0) - (a.total_fees_max || 0);
        case "placement": return (b.placement_percentage || 0) - (a.placement_percentage || 0);
        case "rating":
        default: return (b.rating || 0) - (a.rating || 0);
      }
    });
    setFiltered(filteredList);
  }, [colleges, search, sortBy]);

  const handleSelect = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return [...prev, id];
    });
  };

  const selectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(c => c.id));
  };

  const generatePDF = () => {
    if (selected.length === 0) {
      toast.error("Select at least one college");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My Selected Colleges", 14, 16);
    let startY = 32;
    filtered.filter(c => selected.includes(c.id)).forEach((college, idx) => {
      doc.setFontSize(13);
      doc.text(`${idx + 1}. ${college.name} (${college.location}, ${college.state})`, 14, startY);
      doc.setFontSize(10);
      doc.text(`Type: ${college.type ?? "-"} | Rating: ${college.rating ?? "-"} | Placement: ${college.placement_percentage ?? "-"}%`, 18, startY + 7);
      doc.text(`Fees: ₹${college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : "0"}L - ₹${college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : "0"}L`, 18, startY + 14);
      startY += 24;
      if (startY > 260) { doc.addPage(); startY = 20; }
    });
    doc.save("my_colleges.pdf");
    toast.success("PDF generated!");
  };

  const bestRating = filtered.length > 0 ? Math.max(...filtered.map(c => c.rating || 0)) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-3">
      <h1 className="text-2xl font-bold mb-4">My Selected Colleges</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={sortBy} onValueChange={v => setSortBy(v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="fees_low">Fees (Low to High)</SelectItem>
            <SelectItem value="fees_high">Fees (High to Low)</SelectItem>
            <SelectItem value="placement">Placement %</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" className="ml-auto" onClick={selectAll}>
          {selected.length === filtered.length ? "Deselect All" : "Select All"}
        </Button>
        <Button variant="default" onClick={generatePDF}>
          Generate PDF
        </Button>
      </div>
      {/* College Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(college => (
          <Card
            key={college.id}
            className={`relative border-2 ${selected.includes(college.id) ? "border-green-600" : "border-gray-200"} transition-all`}
            onClick={() => handleSelect(college.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Best Prediction Badge */}
            {college.rating === bestRating && (
              <div className="absolute right-4 top-4 z-10 px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full shadow">
                Best Prediction
              </div>
            )}
            <div className="p-3">
              <h2 className="text-xl font-semibold mb-1">{college.name}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-1"><MapPin className="w-4 h-4 mr-1" />{college.location}, {college.state}</div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-semibold">{college.rating ?? "-"}/5.0</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{college.type}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : "0"}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : "0"}L
                </span>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={e => { e.stopPropagation(); removeCollege(college.id); refetch(); }}>
                Remove from My List
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No added colleges. Add colleges from the main Colleges page!
        </div>
      )}
    </div>
  );
}
