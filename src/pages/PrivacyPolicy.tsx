
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Policy = {
  id: string;
  page_number: number;
  title: string;
  content: string;
};

const PAGE_SIZE = 1; // One "policy page" per route page (simulate book-like pagination)
const MIN_CONTENT = 1000;
const MAX_CONTENT = 100000;

/**
 * For true pagination, fetches per-page policy page.
 */
const PrivacyPolicy = () => {
  // Fetch all pages and order by page_number
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
      .limit(25) // Only first 25 for now
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

  // Check content length constraints for UI
  const contentTooShort = (content: string) => content.length < MIN_CONTENT;
  const contentTooLong = (content: string) => content.length > MAX_CONTENT;

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > pages.length) page = pages.length;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-8 text-center text-lg font-semibold text-blue-700">
        Loading Privacy Policy...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-8 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-8 text-center text-gray-700">
        Privacy Policy content is not available.
      </div>
    );
  }

  // Ensure no out of bounds
  const safePage = Math.min(Math.max(1, currentPage), pages.length);
  const page = pages[safePage - 1];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-8 space-y-6 text-gray-800 overflow-y-auto" style={{ fontSize: "1rem", lineHeight: "2" }}>
      <div className="flex flex-col gap-2 items-center mb-4">
        <h1 className="text-3xl font-extrabold text-blue-800">{page?.title || `Privacy Policy Page ${page?.page_number}`}</h1>
        <small className="text-blue-500 mb-2">
          Page {safePage} of {pages.length}
        </small>
        {/* Navigation */}
        <div className="flex gap-2 items-center">
          <button
            className="px-2 py-1 rounded border shadow-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            Previous
          </button>
          <button
            className="px-2 py-1 rounded border shadow-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === pages.length}
          >
            Next
          </button>
          {/* <Page numbers dropdown for quick nav> */}
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
        </div>
      </div>
      {/* Actual policy for the page */}
      <div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">{page?.title}</h2>
        <div
          className={`whitespace-pre-wrap break-words bg-gray-50 p-4 border border-gray-200 rounded-lg min-h-[300px]`}
          style={{ fontSize: "1.07rem", lineHeight: "2" }}
        >
          {page?.content}

          {/* Warn if too short/long? */}
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
      {/* End page info */}
      <div className="mt-8 text-gray-400 text-xs text-center">
        (Each policy page supports {MIN_CONTENT} - {MAX_CONTENT} characters.
        Total pages: {pages.length} — This page is only visible on desktop devices.)
      </div>
    </div>
  );
};

export default PrivacyPolicy;

