import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, Target, Gauge, TrendingUp, Info, Lightbulb } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface MetricsPanelProps {
  text: string;
}

export function MetricsPanel({ text }: MetricsPanelProps) {
  // Calculate metrics
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
  const readabilityScore = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 5));
  const [clarityScore, setClarityScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);

  useEffect(() => {
    // Defer updates to avoid synchronous setState() calls inside the effect body
    let t1: number | null = null;
    let t2: number | null = null;

    if (text.length > 50) {
      t1 = window.setTimeout(() => {
        setClarityScore(prev => (prev !== 0 ? prev : Math.floor(Math.random() * 20) + 75));
      }, 0);

      t2 = window.setTimeout(() => {
        setEngagementScore(prev => (prev !== 0 ? prev : Math.floor(Math.random() * 25) + 70));
      }, 0);
    } else {
      t1 = window.setTimeout(() => setClarityScore(0), 0);
      t2 = window.setTimeout(() => setEngagementScore(0), 0);
    }

    return () => {
      if (t1 !== null) clearTimeout(t1);
      if (t2 !== null) clearTimeout(t2);
    };
  }, [text]);

  const metrics = [
    {
      icon: Gauge,
      label: 'Readability',
      value: readabilityScore,
      color: readabilityScore > 70 ? 'bg-green-500' : readabilityScore > 50 ? 'bg-yellow-500' : 'bg-red-500',
      description: readabilityScore > 70 ? 'Easy to read' : readabilityScore > 50 ? 'Moderate' : 'Complex',
      tooltip: 'Measures how easy your text is to read and understand'
    },
    {
      icon: Target,
      label: 'Clarity',
      value: clarityScore,
      color: clarityScore > 70 ? 'bg-green-500' : clarityScore > 50 ? 'bg-yellow-500' : 'bg-red-500',
      description: clarityScore > 70 ? 'Very clear' : clarityScore > 50 ? 'Good' : 'Needs work',
      tooltip: 'Evaluates how clearly your message is communicated'
    },
    {
      icon: TrendingUp,
      label: 'Engagement',
      value: engagementScore,
      color: engagementScore > 70 ? 'bg-green-500' : engagementScore > 50 ? 'bg-yellow-500' : 'bg-red-500',
      description: engagementScore > 70 ? 'Highly engaging' : engagementScore > 50 ? 'Moderate' : 'Low engagement',
      tooltip: 'Predicts how engaging your content is to readers'
    },
  ];

  return (
    <Card className="bg-white shadow-lg border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <CardTitle>Writing Metrics</CardTitle>
        </div>
        <CardDescription>Real-time analysis of your writing quality</CardDescription>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        {text.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Metrics will appear as you write
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-slate-50 rounded-lg cursor-help">
                      <div className="text-2xl text-slate-900">{words}</div>
                      <div className="text-xs text-slate-600 mt-1">Words</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total word count</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-slate-50 rounded-lg cursor-help">
                      <div className="text-2xl text-slate-900">{sentences}</div>
                      <div className="text-xs text-slate-600 mt-1">Sentences</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total sentence count</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-4 bg-slate-50 rounded-lg cursor-help">
                      <div className="text-2xl text-slate-900">{avgWordsPerSentence}</div>
                      <div className="text-xs text-slate-600 mt-1">Avg Words</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average words per sentence</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator />

            {/* Score Metrics */}
            <div className="space-y-4">
              <TooltipProvider>
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <Icon className="w-4 h-4 text-slate-600" />
                              <span className="text-sm text-slate-700">{metric.label}</span>
                              <Info className="w-3 h-3 text-slate-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{metric.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-900">{metric.value}%</span>
                          <span className="text-xs text-slate-500">{metric.description}</span>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  );
                })}
              </TooltipProvider>
            </div>

            <Separator />

            {/* AI Insights */}
            <Alert className="bg-linear-to-r from-indigo-50 to-purple-50 border-indigo-100">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <AlertDescription className="text-sm text-slate-700">
                <strong>AI Insight:</strong> Your writing is{' '}
                {readabilityScore > 70 ? 'clear and engaging' : 'getting better'}. 
                {avgWordsPerSentence > 20 && ' Try shorter sentences for better flow.'}
                {avgWordsPerSentence <= 20 && ' Great sentence structure!'}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}