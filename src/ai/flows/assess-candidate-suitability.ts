'use server';

/**
 * @fileOverview Assesses a candidate's suitability for a job by comparing the extracted information from their resume against the job description.
 *
 * - assessCandidateSuitability - A function that handles the candidate suitability assessment process.
 * - AssessCandidateSuitabilityInput - The input type for the assessCandidateSuitability function.
 * - AssessCandidateSuitabilityOutput - The return type for the assessCandidateSuitability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCandidateSuitabilityInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for the position.'),
  resume: z.string().describe('The candidate resume.'),
});
export type AssessCandidateSuitabilityInput = z.infer<
  typeof AssessCandidateSuitabilityInputSchema
>;

const AssessCandidateSuitabilityOutputSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A numerical score indicating the degree of match between the resume and the job description.'
    ),
  suitabilityAnalysis: z
    .string()
    .describe('A textual analysis of the candidate suitability.'),
});
export type AssessCandidateSuitabilityOutput = z.infer<
  typeof AssessCandidateSuitabilityOutputSchema
>;

export async function assessCandidateSuitability(
  input: AssessCandidateSuitabilityInput
): Promise<AssessCandidateSuitabilityOutput> {
  return assessCandidateSuitabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessCandidateSuitabilityPrompt',
  input: {schema: AssessCandidateSuitabilityInputSchema},
  output: {schema: AssessCandidateSuitabilityOutputSchema},
  prompt: `Bạn là một trợ lý AI chuyên đánh giá sự phù hợp của ứng viên cho các vị trí công việc.

Bạn sẽ nhận được một bản mô tả công việc và hồ sơ của một ứng viên. Nhiệm vụ của bạn là phân tích cả hai tài liệu
để xác định mức độ phù hợp của trình độ ứng viên với yêu cầu công việc.

Dựa trên phân tích của bạn, hãy cung cấp một điểm số phù hợp (trên 100) cho biết mức độ khớp giữa hồ sơ và mô tả công việc.
Đồng thời, cung cấp một phân tích chi tiết về sự phù hợp giải thích các điểm mạnh và điểm yếu của ứng viên liên quan đến yêu cầu công việc.

Mô tả công việc: {{{jobDescription}}}

Hồ sơ: {{{resume}}}

Điểm phù hợp: 
Phân tích sự phù hợp: `,
});

const assessCandidateSuitabilityFlow = ai.defineFlow(
  {
    name: 'assessCandidateSuitabilityFlow',
    inputSchema: AssessCandidateSuitabilityInputSchema,
    outputSchema: AssessCandidateSuitabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
