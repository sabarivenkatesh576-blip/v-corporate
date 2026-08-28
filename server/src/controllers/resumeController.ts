import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { AuthRequest } from '../middleware/authMiddleware';
import { Resume } from '../models/Resume';
import { StudentProfile } from '../models/StudentProfile';
import { ResumeParserService } from '../services/resumeParserService';
import { ReadinessCalculator } from '../services/readinessCalculator';
import { CareerRole } from '../shared/types';

export const uploadAndAnalyzeResume = async (req: AuthRequest, res: Response) => {
  try {
    let rawText = '';
    let fileName = 'manual-resume-entry.txt';

    if (req.file) {
      fileName = req.file.originalname;
      const filePath = req.file.path;
      const ext = path.extname(fileName).toLowerCase();

      if (ext === '.pdf') {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        rawText = data.text;
      } else if (ext === '.docx' || ext === '.doc') {
        const result = await mammoth.extractRawText({ path: filePath });
        rawText = result.value;
      } else {
        rawText = fs.readFileSync(filePath, 'utf-8');
      }
    } else if (req.body.text) {
      rawText = req.body.text;
      fileName = req.body.fileName || 'pasted-resume.txt';
    } else {
      return res.status(400).json({ error: 'Please upload a PDF/DOCX file or provide text content.' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const targetRole = (req.body.targetRole || profile?.targetRole || 'Software Developer') as CareerRole;

    const parseResult = ResumeParserService.parseText(rawText, targetRole);

    let resumeDoc = await Resume.findOne({ userId: req.user._id });
    if (resumeDoc) {
      resumeDoc.fileName = fileName;
      resumeDoc.rawText = rawText;
      resumeDoc.parsedData = parseResult.parsedData;
      resumeDoc.analysis = parseResult.analysis;
      await resumeDoc.save();
    } else {
      resumeDoc = await Resume.create({
        userId: req.user._id,
        fileName,
        rawText,
        parsedData: parseResult.parsedData,
        analysis: parseResult.analysis
      });
    }

    // Update StudentProfile skills
    if (profile && parseResult.parsedData.skills.length > 0) {
      profile.skills = Array.from(new Set([...profile.skills, ...parseResult.parsedData.skills]));
      await profile.save();
    }

    // Update Career Readiness Resume Component
    await ReadinessCalculator.updateComponent(req.user._id.toString(), {
      resume: parseResult.analysis.roleMatchPercentage,
      skills: Math.min(100, Math.round(parseResult.analysis.roleMatchPercentage * 1.1))
    });

    res.json({
      success: true,
      resume: resumeDoc
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process resume' });
  }
};

export const getResume = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    res.json({ success: true, resume });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
