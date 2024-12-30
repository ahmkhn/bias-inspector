"use client";


import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';


import { AlertTriangle, Info, AlertCircle, Lightbulb, Globe, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Progress } from "~/components/ui/progress";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface APIResponse {
  content: string; // This is the raw JSON string
  refusal: string | null; // Can be null or a string
  role: string; // Role of the response, e.g., "assistant"
}
interface apiDataType{
  content : string; // raw json string returned by openai
  refusal : string | null;
  role : string;
}
interface BiasDataType {
  bias_analysis: {
    highlighted_phrase: string;
    type_of_bias: string;
    suggested_improvement: string;
    confidence_score: number;
  }[];
  final_summary: string;
  key_findings: {
    category: string;
    details: string;
  }[];
}
interface BiasAnalysis {
  highlighted_phrase: string;
  type_of_bias: string;
  suggested_improvement: string;
  confidence_score: number;
}
interface KeyFinding {
  category: string;
  details: string;
}
interface AnalysisResult {
  bias_analysis: BiasAnalysis[];
  final_summary: string;
  key_findings: KeyFinding[];
}
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'];

export default function AnalysisDashboard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [textData, setTextData] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<apiDataType|null>(null);
  const [apiContent, setApiContent] = useState<AnalysisResult|null>(null);
  const [analysisStatus, setAnalysisStatus] = useState({
    hasInitialized: false,  // tracks if we've done initial data fetch
    isAnalyzing: false,     // tracks if analysis is in progress
    isComplete: false       // tracks if analysis is complete
  });



  useEffect(() => {
    if (!isLoaded) return;

    // redirect if user is not authenticated
    if (!userId) {
      router.push("/upload");
      return;
    }

    if (!analysisStatus.hasInitialized) {
      const storedData = localStorage.getItem("textData");
      
      if (!storedData) {
        router.push("/");
        return;
      }

      setTextData(storedData);
      setAnalysisStatus(prev => ({ ...prev, hasInitialized: true }));
    }
  }, [isLoaded, userId, router, analysisStatus.hasInitialized]);

  // handle API analysis
  useEffect(() => {
    // Only proceed if we have data and haven't started analysis yet
    if (textData && !analysisStatus.isAnalyzing && !analysisStatus.isComplete) {
      const analyzeData = async () => {
        setAnalysisStatus(prev => ({ ...prev, isAnalyzing: true }));
        
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ textData }),
          });

          if (!response.ok) {
            throw new Error('Failed to analyze');
          }

          const data = await response.json();
          setApiResponse(data.result);
          console.log('Analysis complete:', data.result);
          
          // clean data
          if (data.result?.content) {
            try {
              // Clean the content string by removing the surrounding "```json" and "```"
              const cleanedContent = data.result.content
                .replace(/^```json\s*/, "") // Remove opening ```json
                .replace(/```$/, "");       // Remove closing ```
                
              // Parse the cleaned JSON string
              const parsedContent: AnalysisResult = JSON.parse(cleanedContent);
          
              setApiContent(parsedContent);
              console.log(parsedContent);
              console.log('this is api content');
            } catch (error) {
              console.error('Failed to parse API response:', error);
            }
          }
          
          // clear all local storage, we don't use it for anything else.
          localStorage.clear();
          
          setAnalysisStatus(prev => ({
            ...prev,
            isAnalyzing: false,
            isComplete: true
          }));

        } catch (error) {
          console.error('Analysis failed:', error);
          setAnalysisStatus(prev => ({ ...prev, isAnalyzing: false }));
        }
      };

      analyzeData();
    }
  }, [textData, analysisStatus.isAnalyzing, analysisStatus.isComplete]);


  // all is good

  if (!isLoaded || !analysisStatus.isComplete) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#f0f0f0", // Optional background color
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
        >
          <path
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity=".25"
          />
          <path
            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            className="spinner_ajPY"
          />
        </svg>
      </div>
    );
  }

  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
  
  function KeyFindings({ findings }: { findings: KeyFinding[] }) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {findings.map((finding, index) => (
            <div className="flex items-start gap-3" key={index}>
              <AlertCircle className="h-5 w-5 text-chart-1" />
              <div>
                <p className="font-medium">{finding.category}</p>
                <p className="text-sm text-muted-foreground">{finding.details}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  function ImprovementSuggestions({ biasAnalysis }: { biasAnalysis: Array<{
    highlighted_phrase: string;
    type_of_bias: string;
    suggested_improvement: string;
    confidence_score: number;
  }> }) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Suggested Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4 custom-scrollbar">
            <div className="space-y-6">
              {biasAnalysis.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.type_of_bias === "Regional/Cultural Bias" && (
                      <Globe className="h-4 w-4 text-chart-1" />
                    )}
                    {item.type_of_bias === "Missing Viewpoints or Perspectives" && (
                      <Users className="h-4 w-4 text-chart-2" />
                    )}
                    {item.type_of_bias === "Colonial Perspectives" && (
                      <BookOpen className="h-4 w-4 text-chart-3" />
                    )}
                    <h3 className="font-medium">Original Text:</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    "{item.highlighted_phrase}"
                  </p>
                  <div className="pl-6 pt-2">
                    <p className="text-sm font-medium">Suggestion:</p>
                    <p className="text-sm text-muted-foreground">
                      {item.suggested_improvement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
  
    const averageConfidence = (apiContent?.bias_analysis ?? []).reduce((acc, item) => acc + item.confidence_score, 0) / (apiContent?.bias_analysis?.length || 1) || 0;
  
    const biasTypeCount = apiContent?.bias_analysis.reduce<Record<string, number>>((acc, item) => {
      acc[item.type_of_bias] = (acc[item.type_of_bias] || 0) + 1;
      return acc;
    }, {});
  
    const biasTypeData = Object.entries(biasTypeCount ?? {}).map(([name, count]) => ({
      name,
      count,
    }));
  
    const confidenceData = apiContent?.bias_analysis.map((item, index) => ({
      phrase: `Bias ${index + 1}`,
      score: item.confidence_score,
      type: item.type_of_bias,
    }));
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 dark:from-background dark:via-background dark:to-secondary/10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Bias Analysis Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              AI-powered analysis detected several types of bias in the provided text
            </p>
          </div>
  
          <div className="grid gap-6 md:grid-cols-3">

            {/* score card */}
            <Card className="col-span-1">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-sm text-muted-foreground">
                      {(averageConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={averageConfidence * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
  
            <KeyFindings findings={apiContent?.key_findings ?? []} />

            <ImprovementSuggestions biasAnalysis={apiContent?.bias_analysis ?? []} />

            {/* bias*/}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Bias Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={biasTypeData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) => 
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {biasTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="transition-all duration-200 hover:opacity-80"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* confidence barchart */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Confidence Scores by Instance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer>
                    <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <XAxis
                        dataKey="phrase"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis domain={[0, 1]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg bg-background p-4 shadow-lg ring-1 ring-black/5">
                                <p className="font-medium">{payload[0]?.payload?.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  Confidence: {(Number(payload[0]?.value ?? 0) * 100).toFixed(0)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="score"
                        fill="hsl(var(--chart-1))"
                        className="transition-all duration-200 hover:opacity-80"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
  
          </div>
        </div>
      </div>
    );
  }