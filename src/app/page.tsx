"use client";

import { useState } from "react";
import { Header } from "@/components/app/header";
import { FileUploadCard } from "@/components/app/file-upload-card";
import { ResultsDisplay } from "@/components/app/results-display";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, FileText, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { assessCandidateSuitability } from "@/ai/flows/assess-candidate-suitability";
import { generateInterviewQuestions } from "@/ai/flows/generate-interview-questions";

interface AnalysisResult {
  matchScore: number;
  suitabilityAnalysis: string;
  interviewQuestions: string[];
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState<{ fileName: string; text: string } | null>(null);
  const [resume, setResume] = useState<{ fileName: string; text: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!jobDescription || !resume) {
      toast({
        title: "Missing Documents",
        description: "Please upload both a job description and a resume.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const [suitability, questions] = await Promise.all([
        assessCandidateSuitability({
          jobDescription: jobDescription.text,
          resume: resume.text,
        }),
        generateInterviewQuestions({
          jobDescription: jobDescription.text,
          resume: resume.text,
        }),
      ]);

      setAnalysisResult({
        matchScore: suitability.matchScore,
        suitabilityAnalysis: suitability.suitabilityAnalysis,
        interviewQuestions: questions.interviewQuestions,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AnalysisSkeleton = () => (
    <div className="space-y-8 mt-8">
      <Skeleton className="h-8 w-1/3 mx-auto" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Unlock Your Next Hire
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Upload a job description and a candidate's resume to get an instant, AI-powered suitability analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FileUploadCard
            title="Job Description"
            description="Upload the role's requirements."
            documentType="jobDescription"
            onDataExtracted={(fileName, text) => setJobDescription({ fileName, text })}
            onFileRemoved={() => {
              setJobDescription(null);
              setAnalysisResult(null);
            }}
          >
            <Briefcase className="w-10 h-10 text-accent" />
          </FileUploadCard>

          <FileUploadCard
            title="Candidate's Resume"
            description="Upload the applicant's CV."
            documentType="resume"
            onDataExtracted={(fileName, text) => setResume({ fileName, text })}
            onFileRemoved={() => {
              setResume(null);
              setAnalysisResult(null);
            }}
          >
            <FileText className="w-10 h-10 text-accent" />
          </FileUploadCard>
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={handleAnalysis}
            disabled={!jobDescription || !resume || isLoading}
            className="shadow-lg hover:shadow-primary/50 transition-shadow"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Generate Analysis"}
          </Button>
        </div>

        {isLoading && <AnalysisSkeleton />}
        {analysisResult && !isLoading && <ResultsDisplay {...analysisResult} />}

      </main>

      <footer className="text-center p-4 mt-8 border-t text-sm text-muted-foreground">
        Powered by AI Studio. Built for modern recruiting.
      </footer>
    </div>
  );
}
