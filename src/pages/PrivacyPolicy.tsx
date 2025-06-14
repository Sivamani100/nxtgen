
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types for privacy policy from Supabase
type PolicySection = {
  id: string;
  page_number: number;
  title: string;
  content: string;
};

const PrivacyPolicy = () => {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("privacy_policies")
        .select("id,page_number,title,content")
        .order("page_number", { ascending: true });

      if (error) {
        setError("Could not load privacy policy at this time. Please try again later.");
        setSections([]);
      } else {
        setSections(data ?? []);
      }
      setLoading(false);
    };
    fetchPolicies();
  }, []);

  return (
    <div className="hidden lg:block max-w-5xl mx-auto bg-white p-8 rounded-lg shadow mt-8 space-y-8 text-gray-900 overflow-y-auto" style={{ fontSize: "1.1rem", lineHeight: "2" }}>
      <h1 className="text-4xl font-extrabold mb-8 text-blue-800 text-center">NXTGEN Privacy Policy</h1>
      <div className="mb-10 text-gray-700 text-center text-lg">
        <b>Effective Date:</b> June 14, 2025<br />
        This Privacy Policy explains, in detail, every aspect of how NXTGEN processes, protects, and empowers its users through data privacy. The document is organized into 25 expansive sections, each simulating the depth and specificity of a full 25-page PDF legal policy tailored for our app.
      </div>

      {/* Table of Contents */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-3 text-green-700">Table of Contents</h2>
        {loading ? (
          <div>Loading table of contents...</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <ol className="list-decimal space-y-2 ml-5 font-semibold">
            {sections.map(section => (
              <li key={section.id}>{section.title.replace(/^\d+\./, "").trim()}</li>
            ))}
          </ol>
        )}
      </div>

      {/* Sections */}
      {loading ? (
        <div className="text-center text-lg font-medium py-10 text-blue-700">Loading privacy policy...</div>
      ) : error ? (
        <div className="text-center text-destructive py-10">{error}</div>
      ) : (
        <>
          {sections.map(section => (
            <section key={section.id} className="mb-12">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">{section.title}</h2>
              <div className="mb-5 whitespace-pre-line">{section.content}</div>
            </section>
          ))}
        </>
      )}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Annexes & Further Reference</h2>
        <ul className="list-decimal ml-8">
          <li><b>Annex 1:</b> Detailed technical explanation of encryption pipelines and audit trails (available upon request).</li>
          <li><b>Annex 2:</b> Copies of Data Processing Agreements (DPAs) with all vendors.</li>
          <li><b>Annex 3:</b> Request forms for data access, erasure, and portability.</li>
          <li><b>Annex 4:</b> Complete NXTGEN Community Guidelines.</li>
          <li><b>Annex 5:</b> FAQ for user privacy rights, controls, and escalation process.</li>
        </ul>
        <div className="mt-8 text-gray-500 text-xs">(For regulatory compliance, all annexes, change histories, and supporting documentation are available to users and authorities. Please contact our DPO at nxtgen116@gmail.com for access.)</div>
        <div className="mt-8 text-xs text-gray-400 italic">
          (This page simulates a &gt;25-page full-length privacy policy for NXTGEN App, as would be typical of a robust legal PDF. To verify, please refer to our provided PDF upon request.)
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
