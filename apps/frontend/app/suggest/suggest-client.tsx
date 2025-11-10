"use client";
import { Navbar } from '@/components/navbar/navbar';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react'
import Link from "next/link";
import { useState } from "react";

export default function SuggestClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (data.suggestion) setOutput(data.suggestion);
      else setError("No suggestion received.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-svw h-svh bg-gray-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">✍️ WriteWise AI</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            className="p-3 border border-gray-300 rounded-md w-full h-48 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Enhancing..." : "Enhance Writing"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {output && (
          <div className="mt-8 w-full max-w-xl">
            <h2 className="font-semibold mb-2">AI Suggestion:</h2>
            <p className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap">
              {output}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
