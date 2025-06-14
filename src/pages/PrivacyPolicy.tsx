
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

type Policy = {
  id: string;
  page_number: number;
  title: string;
  content: string;
};

const PAGE_SIZE = 1;
const MIN_CONTENT = 1000;
const MAX_CONTENT = 100000;

const PrivacyPolicy = () => {
  const [pages, setPages] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("privacy_policies")
      .select()
      .order("page_number", { ascending: true })
      .limit(25) // Fetch up to 25 pages
      .then(({ data, error }) => {
        if (error) {
          setError("Could not fetch privacy policy pages.");
          setPages([]);
        } else {
          setPages(data ?? []);
          setError(null);
        }
        setLoading(false);
      });
  }, []);

  const contentTooShort = (content: string) => content.length < MIN_CONTENT;
  const contentTooLong = (content: string) => content.length > MAX_CONTENT;

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > pages.length) page = pages.length;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg mt-10 text-center text-lg font-semibold text-blue-700">
        <Shield className="inline-block w-8 h-8 mr-2 text-green-600" />
        Loading Privacy Policy...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg mt-10 text-center text-red-600 text-lg">
        <Shield className="inline-block w-8 h-8 mr-2 text-green-600" />
        {error}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg mt-10 text-center text-gray-700">
        <Shield className="inline-block w-8 h-8 mr-2 text-green-600" />
        Privacy Policy content is not available.
      </div>
    );
  }

  const safePage = Math.min(Math.max(1, currentPage), pages.length);
  const page = pages[safePage - 1];

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg mt-12 space-y-6 text-gray-800 overflow-y-auto" style={{ fontSize: "1.06rem", lineHeight: "2" }}>
      <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-green-600" />
          <h1 className="text-3xl font-extrabold text-blue-800">Privacy Policy</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="px-3 py-1 rounded border shadow-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded border shadow-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === pages.length}
          >
            Next
          </button>
          <select
            value={safePage}
            onChange={e => goToPage(Number(e.target.value))}
            className="ml-4 border rounded px-2 py-1 text-sm"
          >
            {pages.map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Page {idx + 1}
              </option>
            ))}
          </select>
          <span className="text-blue-500 ml-4">Page {safePage}/{pages.length}</span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">{page?.title}</h2>
        <div
          className="whitespace-pre-wrap break-words bg-gray-50 p-6 border border-gray-200 rounded-lg min-h-[300px] text-base"
        >
          {page?.content}
          {page && contentTooShort(page.content) && (
            <div className="mt-4 text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Warning: Content for this page is less than {MIN_CONTENT} characters.
            </div>
          )}
          {page && contentTooLong(page.content) && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              Warning: Content for this page exceeds {MAX_CONTENT} characters.
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-gray-400 text-xs text-center">
        (Each policy page supports {MIN_CONTENT} - {MAX_CONTENT} characters.
        Total pages: {pages.length} — This page is only visible on desktop devices.)
      </div>
    </div>
  );
};

export default PrivacyPolicy;
