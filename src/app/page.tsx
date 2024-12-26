"use client";
import Link from "next/link";
import { db } from "~/server/db";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { getUserPDFs } from "~/server/queries";
import { TopNav } from "./_components/topnav";
// everytime a change is made in the DB, the page will be updated on next visit.
export const dynamic = "force-dynamic";


import { Upload, ChartBar, Brain, Shield, LineChart, Github, Router} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              <span className="block">Uncover Hidden Biases in</span>
              <span className="block text-blue-600">Academic Research</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Bias Inspector: The AI-powered tool that scans research papers for colonial, gender, and regional biases. 
              Elevate your academic content with our cutting-edge NLP technology.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link 
                href="/upload"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors md:py-4 md:text-lg md:px-10"
              >
                <Upload className="w-5 h-5 mr-2" />
                Try it Now
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-card text-blue-600 hover:bg-card/80 transition-colors md:py-4 md:text-lg md:px-10 border-gray-200 border-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-card">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-primary">Key Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover how Bias Inspector can revolutionize your research process.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'PDF/Text Input',
                  description: 'Upload research papers or paste text directly for analysis.',
                  icon: ChartBar,
                },
                {
                  name: 'NLP Bias Detection',
                  description: 'Utilize advanced AI models to identify and highlight biased language.',
                  icon: Brain,
                },
                {
                  name: 'Bias Dashboard',
                  description: 'View comprehensive reports with heatmaps, charts, and bias scores.',
                  icon: LineChart,
                },
                {
                  name: 'Privacy',
                  description: 'All documents are deleted after analysis to ensure data security.',
                  icon: Shield,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative p-6 rounded-xl bg-background">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">{feature.name}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section for the future*/}
        {/*<div className="bg-background">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-muted-foreground">Documents Analyzed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>
        </div>*/}
      </main>
    </div>
  );
}