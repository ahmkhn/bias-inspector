"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'];

export default function AnalysisDashboard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [textData, setTextData] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState(null);
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
          
          // only remove from localStorage after successful analysis
          localStorage.removeItem("textData");
          
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


  // Prepare data for charts
  const biasTypeData = [
    { name: 'Cultural Bias', count: 2 },
    { name: 'Regional Bias', count: 2 },
    { name: 'Economic Bias', count: 1 },
    { name: 'Colonial Bias', count: 1 },
    { name: 'Missing Perspectives', count: 1 },
  ];

  const confidenceData = [
    { phrase: 'Cultural Understanding', score: 0.85 },
    { phrase: 'Regional Context', score: 0.90 },
    { phrase: 'Economic Analysis', score: 0.80 },
    { phrase: 'European Laws', score: 0.88 },
    { phrase: 'Privacy Framework', score: 0.75 },
    { phrase: 'Western Perspective', score: 0.82 },
    { phrase: 'Legal Context', score: 0.78 },
  ];

  const averageConfidence = 0.83;
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


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Bias Analysis Results</h1>
          <p className="mt-2 text-muted-foreground">
            AI-powered analysis detected several types of bias in your text
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Summary Card */}
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-primary">Key Findings</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-1 h-5 w-5 text-blue-600" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-primary">Regional/Cultural Bias:</span> Text emphasizes Western norms, particularly US and EU perspectives.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-1 h-5 w-5 text-blue-600" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-primary">Missing Perspectives:</span> Limited representation from Global South and Indigenous communities.
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-primary text-center mr-4">Overall Confidence Of Bias</h2>
            <div className="flex items-center justify-center">
              <div className="relative h-48 w-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[{ value: averageConfidence }, { value: 1 - averageConfidence }]}
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={0}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{(averageConfidence * 100).toFixed(0)}%</span>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bias Distribution */}
          <div className="rounded-lg bg-card p-6 shadow-lg md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-primary">Confidence Scores by Section</h2>
            <div className="h-80">
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
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bias Type Distribution */}
          <div className="rounded-lg bg-card p-6 shadow-lg md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-primary">Bias Type Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={biasTypeData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {biasTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}