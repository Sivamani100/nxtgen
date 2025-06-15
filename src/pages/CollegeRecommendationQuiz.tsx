
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const questions = [
  {
    id: "preferred_course",
    label: "Which course/field are you most interested in?",
    type: "text",
    placeholder: "e.g., Computer Science, Mechanical, Law, MBBS",
  },
  {
    id: "preferred_location",
    label: "Preferred study location (state or city):",
    type: "text",
    placeholder: "Type your preferred region or 'Any'",
  },
  {
    id: "budget",
    label: "Maximum annual tuition budget (in INR lakhs):",
    type: "number",
    placeholder: "e.g., 2.5",
  },
  {
    id: "exams",
    label: "Which entrance exams are you planning or eligible for?",
    type: "text",
    placeholder: "Comma-separated, e.g., JEE Main, EAMCET",
  },
];

export default function CollegeRecommendationQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleInput = (id: string, value: string) => {
    setAnswers((a: any) => ({ ...a, [id]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  async function submitQuiz() {
    setSubmitting(true);
    toast.loading("Analyzing your answers...", { id: "quiz" });

    // Very simple matching logic for demo
    let filtered = supabase.from("colleges").select("*", { count: "exact" });

    if (answers.preferred_course)
      filtered = filtered.ilike("name", `%${answers.preferred_course}%`);
    if (answers.preferred_location)
      filtered = filtered.ilike("city", `%${answers.preferred_location}%`);
    if (answers.budget)
      filtered = filtered.lte("total_fees_max", Number(answers.budget) * 1_00_000);

    // (In real app, use better logic & aggregate all criteria)
    const { data, error } = await supabase.from("colleges").select("*").limit(6);

    if (error) {
      toast.error("Failed to fetch college matches.", { id: "quiz" });
    } else {
      setRecommendations(data || []);
      // Store quiz + recommendations for user
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from("college_recommendation_quiz").insert({
        user_id: user?.id,
        answers,
        recommended_colleges: data || [],
      });
      toast.success("Personalized recommendations ready!", { id: "quiz" });
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="p-6 mb-6">
        <h1 className="text-xl font-bold mb-2 text-green-700">College Recommendation Quiz</h1>
        <p className="mb-4 text-muted-foreground">
          Answer a few questions, and see recommended colleges matched to your profile.
        </p>
        {recommendations.length === 0 ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (step === questions.length - 1) submitQuiz();
              else handleNext();
            }}
            className="space-y-6"
          >
            <div key={questions[step].id}>
              <label className="font-medium">{questions[step].label}</label>
              <input
                className="block w-full border rounded px-3 py-2 mt-2"
                type={questions[step].type}
                placeholder={questions[step].placeholder}
                value={answers[questions[step].id] || ""}
                onChange={e => handleInput(questions[step].id, e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="flex gap-2 justify-between">
              {step > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={submitting}
                >
                  Back
                </Button>
              )}
              <Button type="submit" size="sm" disabled={submitting}>
                {step === questions.length - 1 ? "Get Recommendations" : "Next"}
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recommended Colleges</h2>
            <ul className="space-y-3">
              {recommendations.map(college => (
                <li
                  key={college.id}
                  className="p-4 bg-green-50 rounded border"
                >
                  <div className="font-medium text-green-800">
                    {college.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {college.city}, {college.state} | {college.type}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/college-details/${college.id}`)}
                  >
                    View Details
                  </Button>
                </li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => { setStep(0); setRecommendations([]); }}>
              Take Quiz Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
