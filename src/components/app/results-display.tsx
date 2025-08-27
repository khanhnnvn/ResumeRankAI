"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Check, ShieldCheck } from 'lucide-react';

interface ResultsDisplayProps {
  matchScore: number;
  suitabilityAnalysis: string;
  interviewQuestions: string[];
}

export function ResultsDisplay({
  matchScore,
  suitabilityAnalysis,
  interviewQuestions,
}: ResultsDisplayProps) {
  return (
    <div className="space-y-8 mt-12 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-center">Kết quả phân tích</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary"/>
              <CardTitle>Điểm phù hợp</CardTitle>
            </div>
            <CardDescription>Mức độ phù hợp của ứng viên với công việc.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-4">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        className="text-muted/20"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="text-primary"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${matchScore}, 100`}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{matchScore}</span>
                    <span className="text-2xl font-semibold text-muted-foreground">%</span>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-primary"/>
              <CardTitle>Phân tích sự phù hợp</CardTitle>
            </div>
            <CardDescription>Tóm tắt hồ sơ ứng viên do AI tạo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {suitabilityAnalysis}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            <CardTitle>Câu hỏi phỏng vấn đề xuất</CardTitle>
          </div>
          <CardDescription>Các câu hỏi do AI tạo để tìm hiểu sâu hơn về kỹ năng của ứng viên.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {interviewQuestions.map((question, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>Câu hỏi {index + 1}</AccordionTrigger>
                <AccordionContent className="text-base">{question}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
