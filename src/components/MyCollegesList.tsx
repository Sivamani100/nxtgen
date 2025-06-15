
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  type?: string;
  state?: string;
  city?: string;
  rating?: number;
  total_fees_min?: number;
  placement_percentage?: number;
  image_url?: string;
  isBest?: boolean;
}

export default function MyCollegesList({
  colleges,
  selected,
  onToggleSelect,
}: {
  colleges: College[],
  selected: number[],
  onToggleSelect: (id: number) => void
}) {
  if (!colleges.length)
    return (
      <div className="text-gray-500 text-center py-12">
        No colleges in your list yet.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {colleges.map((college) => (
        <Card key={college.id} className="flex gap-3 items-center p-4 border group relative shadow-sm">
          <Checkbox checked={selected.includes(college.id)}
            onCheckedChange={() => onToggleSelect(college.id)}
            className="mr-2" />
          {college.image_url ? (
            <img src={college.image_url} alt={college.name} className="w-16 h-16 object-cover rounded-lg"/>
          ) : (
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg text-3xl text-blue-400">{college.name?.[0]}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{college.name}</span>
              {college.isBest && (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full gap-1"><Star className="w-4 h-4 text-green-600" /> Best</span>
              )}
            </div>
            <div className="text-xs text-gray-700">{college.location}, {college.state}</div>
            <div className="text-xs text-gray-500">{college.type}</div>
            <div className="flex text-xs gap-2 mt-1 flex-wrap">
              {college.rating && <span>⭐ {college.rating}/5.0</span>}
              {college.placement_percentage && <span>📈 {college.placement_percentage}% Placed</span>}
              {college.total_fees_min && <span>💰 ₹{(college.total_fees_min / 100000).toFixed(1)}L</span>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
