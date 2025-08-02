import { Controller, Post, UploadedFiles, Body, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnalyzeService } from './analyze.service';
import { memoryStorage } from 'multer';
import * as pdfParse from 'pdf-parse';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 2,
        fields: 1,
      },
    }),
  )
  async analyze(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('question') question: string,
  ) {
    console.log(
      'Files received:',
      files?.map(file => ({
        fieldname: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      })),
    );
    console.log('Question received:', question);

    if (!files || files.length !== 2) {
      console.error('Expected exactly two files');
      throw new BadRequestException('Exactly two files (resume and intervention) are required');
    }

    if (!question) {
      console.error('No question received');
      throw new BadRequestException('Question field is required');
    }

    const resumeFile = files.find(file => file.fieldname === 'files' && file.originalname.includes('resume'));
    const interventionFile = files.find(file => file.fieldname === 'files' && file.originalname.includes('intervention'));

    if (!resumeFile) {
      console.error('Resume file not found');
      throw new BadRequestException('Resume file is missing');
    }

    if (!interventionFile) {
      console.error('Intervention file not found');
      throw new BadRequestException('Intervention file is missing');
    }

    let interventionData;
    try {
      if (!interventionFile.buffer) {
        console.error('Intervention file buffer is undefined');
        throw new Error('Intervention file buffer is missing');
      }
      const interventionContent = interventionFile.buffer.toString('utf-8');
      console.log('Raw intervention content:', interventionContent);
      interventionData = JSON.parse(interventionContent);
      console.log('Parsed interventionData:', interventionData);
    } catch (error) {
      console.error('Error parsing intervention:', error.message);
      throw new BadRequestException('Invalid intervention format: ' + error.message);
    }

    if (!interventionData.description) {
      console.error('Intervention data missing description');
      throw new BadRequestException('Intervention must contain a description field');
    }

    let resumeText;
    try {
      if (!resumeFile.buffer) {
        console.error('Resume file buffer is undefined');
        throw new Error('Resume file buffer is missing');
      }
      const resumeData = await pdfParse(resumeFile.buffer);
      resumeText = resumeData.text;
      console.log('Extracted resume text (first 500 chars):', resumeText.substring(0, 500));
    } catch (error) {
      console.error('Error parsing resume PDF:', error.message);
      throw new BadRequestException('Invalid resume format: ' + error.message);
    }

    try {
      const response = await this.analyzeService.analyzeResumeAndIntervention(
        resumeText,
        interventionData.description,
        question,
      );
      return { response };
    } catch (error) {
      console.error('Error from AnalyzeService:', error.message);
      throw new BadRequestException(error.message);
    }
  }
}