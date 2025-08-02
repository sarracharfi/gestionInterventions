import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface CloudflareResponse {
  response: string;
}

@Injectable()
export class CloudflareService {
private workerUrl = 'https://ai-assistance.gestionintervention.workers.dev';

  async runAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.workerUrl, {
        prompt,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Cloudflare response:', response.data);
      // On cast manuellement la donnée si besoin :
      const data = response.data as CloudflareResponse;
      return data.response;
    } catch (error: any) {
      console.error('Cloudflare error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(`Failed to run AI: ${error.message}${error.response?.data ? ` - ${JSON.stringify(error.response.data)}` : ''}`);
    }
  }
}
