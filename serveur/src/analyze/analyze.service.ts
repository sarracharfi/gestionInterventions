import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Injectable()
export class AnalyzeService {
  constructor(private readonly cloudflareService: CloudflareService) {}

  async analyzeResumeAndIntervention(resumeText: string, interventionText: string, question: string) {
    // Truncate texts to avoid exceeding Cloudflare Worker limits
    const maxLength = 5000;
    const truncatedResume = resumeText.length > maxLength ? resumeText.substring(0, maxLength) + '...' : resumeText;
    const truncatedIntervention = interventionText.length > maxLength ? interventionText.substring(0, maxLength) + '...' : interventionText;

    const prompt = `Analyze the following resume and intervention. Resume: "${truncatedResume}". Intervention: "${truncatedIntervention}". Answer the question: "${question}" in French, providing a detailed and professional response.`;

    try {
      const response = await this.cloudflareService.runAI(prompt);
      return response;
    } catch (error) {
      throw new BadRequestException(`Failed to analyze with Cloudflare: ${error.message}`);
    }
  }
}