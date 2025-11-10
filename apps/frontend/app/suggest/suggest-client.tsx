"use client";

import { Navbar } from "@/components/navbar/navbar";
import { WritingEditor } from "@/components/suggest/writing-editor/writing-editor";
import { MetricsPanel } from "@/components/suggest/metrics-panel";
import { SuggestionsPanel } from "@/components/suggest/suggest-panel";
import { useState } from "react";

export default function SuggestClient() {
  const [text, setText] = useState("");
  const [selectedMode, setSelectedMode] = useState("general");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text to enhance.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");
    setAiSuggestions([]);

    try {
      const [suggestRes, analyzeRes] = await Promise.all([
        fetch("http://localhost:3001/openai/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, tone: selectedTone }),
        }),
        fetch("http://localhost:3001/openai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, tone: selectedTone }),
        }),
      ]);

      const suggestData = await suggestRes.json();
      const analyzeData = await analyzeRes.json();

      if (suggestData.suggestion) setOutput(suggestData.suggestion);
      if (analyzeData.suggestions) setAiSuggestions(analyzeData.suggestions);
    } catch (err) {
      setError((err as Error).message || "Failed to contact backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WritingEditor
              text={text}
              setText={setText}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              selectedTone={selectedTone}
              setSelectedTone={setSelectedTone}
              onSubmit={handleSubmit}
              loading={loading}
            />
            <MetricsPanel text={text} />
          </div>

          <div className="lg:col-span-1">
            <SuggestionsPanel
              text={text}
              selectedTone={selectedTone}
              output={output}
              loading={loading}
              error={error}
              aiSuggestions={aiSuggestions}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
