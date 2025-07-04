
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
    <div className="grid grid-cols-1 gap-4">
      {colleges.map((college) => (
        <Card key={college.id} className="flex gap-3 items-start p-4 border group relative shadow-sm">
          <Checkbox 
            checked={selected.includes(college.id)}
            onCheckedChange={() => onToggleSelect(college.id)}
            className="mt-1 flex-shrink-0" 
          />
          
          {college.image_url ? (
            <img 
              src={college.image_url} 
              alt={college.name} 
              className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 flex items-center justify-center rounded-lg text-2xl lg:text-3xl text-blue-400 flex-shrink-0">
              {college.name?.[0]}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-sm lg:text-base line-clamp-2 flex-1">
                {college.name}
              </h3>
              {college.isBest && (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 text-green-600" /> 
                  Best
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="text-xs lg:text-sm text-gray-700">
                {college.location}{college.state ? `, ${college.state}` : ''}
              </div>
              {college.type && (
                <div className="text-xs text-gray-500">{college.type}</div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {college.rating && (
                  <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                    ⭐ {college.rating}/5.0
                  </span>
                )}
                {college.placement_percentage && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    📈 {college.placement_percentage}% Placed
                  </span>
                )}
                {college.total_fees_min && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    💰 ₹{(college.total_fees_min / 100000).toFixed(1)}L
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
