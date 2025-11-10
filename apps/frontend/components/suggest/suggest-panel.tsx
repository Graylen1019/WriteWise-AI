"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Lightbulb, AlertCircle, CheckCircle, Wand2 } from "lucide-react";

interface Suggestion {
  id: string;
  type: "improvement" | "grammar" | "clarity" | "tone";
  title: string;
  description: string;
  original: string;
  suggested: string;
}

interface SuggestionsPanelProps {
  text: string;
  selectedTone: string;
  output: string;
  loading: boolean;
  error: string;
  aiSuggestions?: Suggestion[];
}

export function SuggestionsPanel({
  text,
  selectedTone,
  output,
  loading,
  error,
  aiSuggestions = [],
}: SuggestionsPanelProps) {
  const [liveAnalysis, setLiveAnalysis] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);

  // 🔁 Live streaming effect
  useEffect(() => {
    if (!text.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiveAnalysis("");
      return;
    }

    const controller = new AbortController();
    const run = async () => {
      try {
        setLiveLoading(true);
        setLiveAnalysis("");

        const res = await fetch("http://localhost:3001/openai/analyze-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, tone: selectedTone }),
          signal: controller.signal,
        });

        if (!res.body) {
          setLiveLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneChunk } = await reader.read();
          done = doneChunk;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            setLiveAnalysis((prev) => prev + chunk);
          }
        }

        setLiveLoading(false);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Live AI stream error:", err);
        }
        setLiveLoading(false);
      }
    };

    run();

    // Abort previous stream when user types again
    return () => controller.abort();
  }, [text, selectedTone]);

  const combined = aiSuggestions; // structured suggestions from /openai/analyze (button-triggered)

  const getIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return <AlertCircle className="w-4 h-4" />;
      case "improvement":
        return <Lightbulb className="w-4 h-4" />;
      case "clarity":
        return <CheckCircle className="w-4 h-4" />;
      case "tone":
        return <Wand2 className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-slate-200 sticky top-24">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 font-semibold">AI Suggestions</h3>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
            {combined.length} structured
          </Badge>
        </div>

        <Separator />

        {/* 🔴 Error from main operations */}
        {error && <div className="py-2 text-center text-red-500">{error}</div>}

        {/* ✨ AI Rewrite from /openai/suggest */}
        {!loading && !error && output && (
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 whitespace-pre-wrap text-slate-700 text-sm mb-2">
            <h4 className="font-semibold mb-1 text-indigo-700">AI Rewrite</h4>
            {output}
          </div>
        )}

        {/* ⚡ Live streaming analysis */}
        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-md mb-3 min-h-[60px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">
              Live AI analysis
            </span>
            {liveLoading && (
              <span className="text-[10px] text-indigo-500 animate-pulse">
                Streaming...
              </span>
            )}
          </div>
          <div className="text-xs text-slate-700 whitespace-pre-wrap">
            {liveAnalysis || (
              <span className="text-slate-400">
                Start typing to see real-time feedback.
              </span>
            )}
          </div>
        </div>

        {/* 🧠 Structured suggestions from /openai/analyze */}
        <ScrollArea className="h-[450px] pr-4">
          {combined.length === 0 ? (
            <div className="text-center text-slate-500 py-6 text-xs">
              Click “Enhance Writing” to get detailed issue-by-issue suggestions.
            </div>
          ) : (
            <div className="space-y-3">
              {combined.map((sug, i) => (
                <HoverCard key={sug.id || i}>
                  <HoverCardTrigger asChild>
                    <div className="p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-700">
                          {getIcon(sug.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm text-slate-900">
                              {sug.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {sug.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">
                            {sug.description}
                          </p>

                          {sug.original && (
                            <>
                              <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-slate-700">
                                <span className="text-red-600">Original:</span>{" "}
                                {sug.original}
                              </div>
                              <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-slate-700">
                                <span className="text-green-600">
                                  Suggested:
                                </span>{" "}
                                {sug.suggested}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 text-xs">
                    {sug.description}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
}
