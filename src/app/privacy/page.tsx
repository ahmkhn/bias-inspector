"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Shield, Trash2, Lock, Eye } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 flex items-center">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Collection and Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We collect only the text data you submit for bias analysis. This data is processed in real-time and is not stored permanently on our servers.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Trash2 className="h-4 w-4" />
                <span>We ensure that all uploaded data is automatically deleted after our analysis. However, please note that we do not have control over data storage on external AI models.</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your data during transmission and processing. Our service uses industry-standard encryption and secure protocols.
              </p>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>Icon Attribution:</p>
            <Link 
              href="https://www.flaticon.com/free-icons/inspector" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inspector icons created by Freepik - Flaticon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}