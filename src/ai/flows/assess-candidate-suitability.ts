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
  prompt: `You are an AI assistant specialized in assessing candidate suitability for job positions.

You will receive a job description and a candidate's resume. Your task is to analyze both documents
to determine how well the candidate's qualifications align with the job requirements.

Based on your analysis, provide a match score (out of 100) indicating the degree of match between the resume and the job description.
Also, provide a detailed suitability analysis explaining the strengths and weaknesses of the candidate in relation to the job requirements.

Job Description: {{{jobDescription}}}

Resume: {{{resume}}}

Match Score: 
Suitability Analysis: `,
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
