
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type College = Database["public"]["Tables"]["colleges"]["Row"];
type SelectedCollegesRow = {
  id: string;
  user_id: string;
  college_id: number;
  created_at: string;
};

export const useUserSelectedColleges = () => {
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSelected = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSelectedCollegeIds([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("user_selected_colleges")
      .select("college_id");
    if (!error) {
      setSelectedCollegeIds(data?.map(d => d.college_id) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSelected();
  }, [fetchSelected]);

  const addCollege = async (college_id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("user_selected_colleges").insert({
      user_id: user.id,
      college_id,
    });
    setSelectedCollegeIds((prev) => prev.includes(college_id) ? prev : [...prev, college_id]);
  };

  const removeCollege = async (college_id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("user_selected_colleges")
      .delete()
      .eq("user_id", user.id)
      .eq("college_id", college_id);
    setSelectedCollegeIds((prev) => prev.filter(id => id !== college_id));
  };

  return { selectedCollegeIds, addCollege, removeCollege, loading, refetch: fetchSelected };
};
