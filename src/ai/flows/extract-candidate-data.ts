'use server';

/**
 * @fileOverview A flow to extract key information from resumes and job descriptions.
 *
 * - extractCandidateData - Extracts key skills, experience, and qualifications from a document.
 * - ExtractCandidateDataInput - The input type for the extractCandidateData function.
 * - ExtractCandidateDataOutput - The return type for the extractCandidateData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractCandidateDataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (resume or job description) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z.enum(['resume', 'jobDescription']).describe('The type of document being processed.'),
});
export type ExtractCandidateDataInput = z.infer<typeof ExtractCandidateDataInputSchema>;

const ExtractCandidateDataOutputSchema = z.object({
  extractedData: z
    .string()
    .describe('The extracted key information (skills, experience, qualifications) from the document.'),
});
export type ExtractCandidateDataOutput = z.infer<typeof ExtractCandidateDataOutputSchema>;

export async function extractCandidateData(
  input: ExtractCandidateDataInput
): Promise<ExtractCandidateDataOutput> {
  return extractCandidateDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractCandidateDataPrompt',
  input: {schema: ExtractCandidateDataInputSchema},
  output: {schema: ExtractCandidateDataOutputSchema},
  prompt: `You are an expert in extracting key information from documents.

  You will be given a document (resume or job description) and you will extract the key information from it, including skills, experience, and qualifications.

  Document Type: {{{documentType}}}
  Document: {{media url=documentDataUri}}

  Extracted Data:`,
});

const extractCandidateDataFlow = ai.defineFlow(
  {
    name: 'extractCandidateDataFlow',
    inputSchema: ExtractCandidateDataInputSchema,
    outputSchema: ExtractCandidateDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
