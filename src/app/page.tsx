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
import { generateInterviewQuestions, GenerateInterviewQuestionsOutput } from "@/ai/flows/generate-interview-questions";

interface AnalysisResult {
  matchScore: number;
  suitabilityAnalysis: string;
  interviewQuestions: GenerateInterviewQuestionsOutput;
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
        title: "Thiếu tài liệu",
        description: "Vui lòng tải lên cả mô tả công việc và hồ sơ.",
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
        interviewQuestions: questions,
      });
    } catch (error) {
      console.error("Phân tích thất bại:", error);
      toast({
        title: "Phân tích thất bại",
        description: "Đã xảy ra lỗi không mong muốn trong quá trình phân tích. Vui lòng thử lại.",
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
            Nhận xét ứng viên tự động
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Tải lên mô tả công việc và hồ sơ của ứng viên để nhận ngay phân tích sự phù hợp do AI cung cấp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FileUploadCard
            title="Mô tả công việc"
            description="Tải lên yêu cầu của vị trí."
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
            title="Hồ sơ ứng viên"
            description="Tải lên CV của ứng viên."
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
            {isLoading ? "Đang phân tích..." : "Tạo phân tích"}
          </Button>
        </div>

        {isLoading && <AnalysisSkeleton />}
        {analysisResult && !isLoading && <ResultsDisplay {...analysisResult} />}

      </main>

      <footer className="text-center p-4 mt-8 border-t text-sm text-muted-foreground">
        Xây dựng cho tuyển dụng hiện đại.
      </footer>
    </div>
  );
}
