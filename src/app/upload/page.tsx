"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { SimpleUploadButton } from "../_components/simple-upload-button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import OpenAI from "openai";


export default function DashboardPage() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("text"); // "text" or "pdf"
  const [fileName, getFileName] = useState("");
  const [url, setURLHook] = useState("");

  const handleAnalyze = async () => {
    try{
      const response = await fetch('/api/analyze', {
        method: 'POST'
      });
      if(!response.ok){
        throw new Error('Failed to analyze');
      }
      const data = await response.json();
      console.log(data);
    }catch(error){
      console.error(error);
    }
  };

  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <SignedIn>
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary">Analysis Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                  Submit your research paper or text for AI-powered bias analysis
                </p>
              </div>

              {/* Tab Selection */}
              <div className="mb-6 flex rounded-lg bg-card p-1">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    activeTab === "text"
                      ? "bg-blue-600 text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <FileText className="mr-2 inline-block h-4 w-4" />
                  Text Input
                </button>
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    activeTab === "pdf"
                      ? "bg-blue-600 text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Upload className="mr-2 inline-block h-4 w-4" />
                  PDF Upload
                </button>
              </div>

              {/* Input Area */}
              <div className="rounded-lg bg-card p-6 shadow-lg">
                {activeTab === "text" ? (
                  <div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter your text here (minimum 300 words)..."
                      className="min-h-[300px] w-full rounded-lg border border-border bg-background p-4 text-foreground focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <p className="text-gray-400">{text.split(/\s+/).length - 1} words</p>
                    {text.split(/\s+/).length < 300 && text.length > 0 && (
                      <p className="mt-2 flex items-center text-sm text-destructive">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Minimum 300 words required
                      </p>
                    )}
                    {text.split(/\s+/).length > 2000 && (
                      <p className="mt-2 flex items-center text-sm text-destructive">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Maximum 2,000 words allowed
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12">
                    <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">Drop your PDF here</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      or click to browse files
                    </p>

                    <SimpleUploadButton setFileName={getFileName} setURL={setURLHook} />
                  
                    <label
                      htmlFor="pdf-upload"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Select PDF
                    </label>
                    <p className="text-black">{fileName}</p>
                  </div>
                )}

                {/* Analyze Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={
                      (activeTab === "text" && (text.split(/\s+/).length < 300 || text.split(/\s+/).length > 2000)) ||
                      (activeTab === "pdf" && fileName === "" && url === "")
                    }                    
                    className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Sign in Required</h1>
            <p className="text-muted-foreground">
              Please sign up or sign in to access the analysis dashboard and start detecting biases in your research.
            </p>
          </div>
        </div>
      </SignedOut>
    </div>
    
  );
}