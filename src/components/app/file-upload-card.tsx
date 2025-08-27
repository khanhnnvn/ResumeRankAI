"use client";

import { useState, type ChangeEvent, type ReactNode, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractCandidateData } from "@/ai/flows/extract-candidate-data";

type UploadState = "idle" | "uploading" | "success" | "error";

interface FileUploadCardProps {
  title: string;
  description: string;
  onDataExtracted: (fileName: string, text: string) => void;
  onFileRemoved: () => void;
  documentType: "resume" | "jobDescription";
  children: ReactNode;
}

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function FileUploadCard({
  title,
  description,
  onDataExtracted,
  onFileRemoved,
  documentType,
  children,
}: FileUploadCardProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Loại tệp không hợp lệ",
        description: "Vui lòng tải lên một tệp PDF.",
        variant: "destructive",
      });
      return;
    }

    setUploadState("uploading");
    setFileName(file.name);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      // Upload the file to the server
      const uploadPromise = fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Extract data using Genkit in parallel
      const extractPromise = toDataURL(file).then(dataUri => 
        extractCandidateData({
          documentDataUri: dataUri,
          documentType: documentType,
        })
      );
      
      // Wait for both operations to complete
      const [uploadResponse, extractResult] = await Promise.all([uploadPromise, extractPromise]);

      if (!uploadResponse.ok) {
        throw new Error("Tải lên tệp thất bại");
      }

      onDataExtracted(file.name, extractResult.extractedData);
      setUploadState("success");
      
    } catch (error) {
      console.error("Lỗi xử lý tệp:", error);
      setUploadState("error");
      toast({
        title: "Xử lý tệp thất bại",
        description: "Đã xảy ra lỗi khi xử lý tệp của bạn. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    setUploadState("idle");
    onFileRemoved();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          {children}
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg bg-muted/25 min-h-[150px]">
          {uploadState === "idle" && (
            <>
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
              <label htmlFor={`file-upload-${documentType}`} className="relative cursor-pointer">
                <Button asChild>
                  <span>Tải lên PDF</span>
                </Button>
                <Input
                  ref={inputRef}
                  id={`file-upload-${documentType}`}
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2">Kích thước tệp tối đa: 10MB</p>
            </>
          )}

          {fileName && (
            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                {uploadState === "uploading" && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploadState === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {uploadState === "error" && <XCircle className="w-5 h-5 text-destructive" />}
                <p className="text-sm font-medium truncate max-w-[200px]">{fileName}</p>
              </div>

              {uploadState !== "uploading" && (
                 <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                  Thay đổi tệp
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
