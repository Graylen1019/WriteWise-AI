import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FileText, Mail, MessageSquare, Newspaper, Zap } from "lucide-react";

type writingEditorProps = {
    text: string;
    setText: (text: string) => void
    selectedMode: string
    setSelectedMode: (mode: string) => void
    selectedTone: string;
    setSelectedTone: (tone: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

const modes = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'social', label: 'Social Media', icon: MessageSquare },
    { id: 'blog', label: 'Blog Post', icon: Newspaper },
]

const tones = [
    { id: "professional", label: 'Professional' },
    { id: "casual", label: 'Casual' },
    { id: "friendly", label: 'Friendly' },
    { id: "formal", label: 'Formal' },
    { id: "creative", label: 'Creative' },
]

export const WritingEditor = ({
    text,
    setText,
    selectedMode,
    setSelectedMode,
    selectedTone,
    setSelectedTone,
    onSubmit,
    loading,
}: writingEditorProps) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    return (
        <Card className="p-6 bg-white shadow-lg border-slate-200">
            <div className="space-y-4">
                {/* Mode Selection */}
                <div>
                    <Label className="mb-2">Writing Mode</Label>
                    <TooltipProvider>
                        <div className="flex gap-2 flex-wrap">
                            {modes.map((mode) => {
                                const Icon = mode.icon;
                                const isSelected = selectedMode === mode.id

                                return (
                                    <Tooltip key={mode.id}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => setSelectedMode(mode.id)}
                                                variant={"new3"}
                                                className={
                                                    isSelected
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                                }
                                            >
                                                <Icon className="size-4" />
                                                <span className="text-sm">{mode.label}</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Optimize for {mode.label.toLowerCase()} writing</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </TooltipProvider>
                </div>

                {/*  Tone Selection */}
                <div>
                    <Label className="mb-2">Tone</Label>
                    <ToggleGroup type="single" value={selectedTone} onValueChange={setSelectedTone}>
                        <div className="flex gap-2 flex-wrap">
                            {tones.map((tone) => (
                                <ToggleGroupItem
                                    key={tone.id}
                                    value={tone.id}
                                    className={`px-4 py-2 rounded-full text-sm transition-all data-[state=on]:bg-linear-to-r data-[state=on]:from-indigo-600 data-[state=on]:to-purple-600 data-[state=on]:text-white`}
                                >
                                    {tone.label}
                                </ToggleGroupItem>
                            ))}
                        </div>
                    </ToggleGroup>
                </div>

                {/* Text Editor */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label>Your Writing</Label>
                        {text && (
                            <div className="flex items-center gap-1 text-xs text-indigo-600">
                                <Zap className="size-3" />
                                <span>AI analyzing...</span>
                            </div>
                        )}
                    </div>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start writing here... AI will provide real-time suggestions to improve your content."
                        className="min-h-[400px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-4">
                            <Badge variant="secondary" className="text-xs">
                                {wordCount} words
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {charCount} characters
                            </Badge>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            onClick={onSubmit}
                            disabled={loading}
                            variant="new2"
                            className="bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Enhancing..." : "Enhance Writing"}
                        </Button>
                    </div>

                </div>
            </div>
        </Card>
    );
}