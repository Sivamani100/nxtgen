
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Question = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

type Answer = {
  id: string;
  question_id: string;
  user_id: string;
  answer: string;
  created_at: string;
};

export default function Forum() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answerContent, setAnswerContent] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForum();
    // eslint-disable-next-line
  }, []);

  async function fetchForum() {
    setLoading(true);
    setError(null);
    try {
      const { data: qs, error: qErr } = await supabase.from("forum_questions").select("*").order("created_at", { ascending: false });
      if (qErr) throw qErr;
      setQuestions(qs || []);

      const { data: as, error: aErr } = await supabase.from("forum_answers").select("*");
      if (aErr) throw aErr;
      const answerMap: Record<string, Answer[]> = {};
      (as || []).forEach(a => {
        if (!answerMap[a.question_id]) answerMap[a.question_id] = [];
        answerMap[a.question_id].push(a);
      });
      setAnswers(answerMap);
    } catch (e: any) {
      console.error("Forum fetch failed:", e);
      setError("Something went wrong loading the forum.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    if (!title.trim() || !content.trim()) {
      toast.error("Please include a title and details.");
      return;
    }
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        toast.error("You must be logged in to post.");
        return;
      }
      const { error } = await supabase.from("forum_questions").insert({
        title,
        content,
        user_id: user?.id,
      });
      if (error) {
        console.error("Post question error:", error);
        toast.error("Question post failed.");
        return;
      }
      toast.success("Question posted!");
      setTitle(""); setContent("");
      fetchForum();
    } catch (e) {
      console.error("Ask error:", e);
      toast.error("Could not post question.");
    }
  }

  async function handleAnswer(qid: string) {
    if (!answerContent[qid] || !answerContent[qid].trim()) {
      toast.error("Please enter an answer.");
      return;
    }
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        toast.error("You must be logged in to answer.");
        return;
      }
      const { error } = await supabase.from("forum_answers").insert({
        answer: answerContent[qid],
        question_id: qid,
        user_id: user?.id,
      });
      if (error) {
        console.error("Answer post error:", error);
        toast.error("Answer not posted.");
        return;
      }
      toast.success("Answer posted!");
      setAnswerContent((ans) => ({ ...ans, [qid]: "" }));
      fetchForum();
    } catch (e) {
      console.error("Answer error:", e);
      toast.error("Could not post answer.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-blue-900 mb-4">Ask an Expert Forum</h1>
      <Card className="mb-6 p-4">
        <div className="mb-3">
          <Input type="text" placeholder="Question Title"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <Input type="text" placeholder="Describe your question or issue"
            value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <Button onClick={handleAsk}>Post Question</Button>
      </Card>
      {error ? (
        <div className="text-red-600 my-3">
          {error}
        </div>
      ) : loading ? (
        <div>Loading forum...</div>
      ) : (
        <div className="space-y-5">
          {questions.length === 0 && (
            <Card className="p-4">
              <div className="text-gray-500">No questions yet. Be the first to ask!</div>
            </Card>
          )}
          {questions.map(q => (
            <Card key={q.id} className="p-4">
              <div className="font-semibold">{q.title}</div>
              <div className="mb-2 text-gray-700">{q.content}</div>
              <div className="text-xs text-gray-400">Posted: {new Date(q.created_at).toLocaleString()}</div>
              <div className="mt-4">
                <span className="font-medium">Answers:</span>
                {answers[q.id]?.length > 0 ? (
                  <ul className="list-disc pl-5 mt-1">
                    {answers[q.id].map(a => (
                      <li key={a.id} className="mb-1">{a.answer}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-500">No answers yet.</div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Write an answer..."
                  value={answerContent[q.id] || ""}
                  onChange={e => setAnswerContent(ans => ({ ...ans, [q.id]: e.target.value }))}
                  className="w-full"
                />
                <Button variant="secondary" size="sm" onClick={() => handleAnswer(q.id)}>
                  Answer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
