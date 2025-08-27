'use server';

/**
 * @fileOverview Generates relevant interview questions based on a job description and resume.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for the position.'),
  resume: z.string().describe('The candidate\'s resume.'),
});
export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  jobDescriptionQuestions: z
    .array(z.string())
    .describe('10 câu hỏi phỏng vấn dựa trên mô tả công việc.'),
  resumeQuestions: z
    .array(z.string())
    .describe('10 câu hỏi phỏng vấn dựa trên hồ sơ của ứng viên.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `Bạn là một chuyên gia tuyển dụng. Dựa trên mô tả công việc và hồ sơ ứng viên dưới đây, hãy tạo ra hai danh sách câu hỏi phỏng vấn:
1. 10 câu hỏi dựa trên mô tả công việc để đánh giá kiến thức và kỹ năng liên quan đến vị trí.
2. 10 câu hỏi dựa trên hồ sơ của ứng viên để làm rõ kinh nghiệm và các chi tiết trong CV.

Mô tả công việc: {{{jobDescription}}}

Hồ sơ: {{{resume}}}`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
