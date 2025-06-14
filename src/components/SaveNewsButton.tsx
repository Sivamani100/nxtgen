
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface SaveNewsButtonProps {
  newsId: number;
  className?: string;
}

const SaveNewsButton = ({ newsId, className = "" }: SaveNewsButtonProps) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaved(false);
        return;
      }
      const { data } = await supabase
        .from("saved_news")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", newsId);
      if (mounted) setSaved(!!(data && data.length > 0));
    })();
    return () => {
      mounted = false;
    };
  }, [newsId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to save news!");
      return;
    }

    if (saved) {
      // Unsave
      const { error } = await supabase
        .from("saved_news")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", newsId);
      if (!error) {
        setSaved(false);
        toast.success("Removed from saved news!");
      } else {
        toast.error("Could not unsave news.");
      }
    } else {
      // Save
      const { error } = await supabase
        .from("saved_news")
        .insert({ user_id: user.id, resource_id: newsId });
      if (!error) {
        setSaved(true);
        toast.success("News saved!");
      } else {
        toast.error("Could not save news.");
      }
    }
    setSaving(false);
  };

  return (
    <button
      title={saved ? "Unsave news" : "Save news"}
      onClick={handleToggle}
      className={`p-1 rounded hover:bg-pink-50 ${className}`}
      aria-pressed={saved}
      disabled={saving}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${saved ? "text-pink-500 fill-pink-500" : "text-gray-400"}`}
      />
    </button>
  );
};

export default SaveNewsButton;
