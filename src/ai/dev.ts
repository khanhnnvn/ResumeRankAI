import { config } from 'dotenv';
config();

import '@/ai/flows/assess-candidate-suitability.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/extract-candidate-data.ts';