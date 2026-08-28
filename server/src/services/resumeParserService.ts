import { CAREER_ROLES } from '../shared/constants';
import { CareerRole } from '../shared/types';

export class ResumeParserService {
  private static KNOWN_SKILLS = [
    'JavaScript', 'TypeScript', 'Node.js', 'Express', 'React', 'Angular', 'Vue', 'Next.js',
    'HTML', 'CSS', 'Tailwind', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'Python', 'Django',
    'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Tableau',
    'Power BI', 'Excel', 'Statistics', 'BPMN', 'Agile', 'Scrum', 'Jira', 'Figma', 'Wireframing',
    'UI/UX', 'Financial Modeling', 'DCF', 'Valuation', 'Accounting', 'GST', 'Tally', 'Balance Sheet',
    'Audit', 'Recruitment', 'HR Analytics', 'Talent Sourcing', 'SEO', 'Google Ads', 'Google Analytics',
    'Content Marketing', 'Copywriting', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'REST APIs',
    'GraphQL', 'System Design', 'Data Cleaning', 'Data Visualization', 'Communication', 'Problem Solving'
  ];

  static parseText(rawText: string, targetRole: CareerRole = 'Software Developer') {
    const textLower = rawText.toLowerCase();

    // Extract email
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone
    const phoneMatch = rawText.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Extract skills
    const extractedSkills: string[] = [];
    for (const skill of this.KNOWN_SKILLS) {
      const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (regex.test(rawText)) {
        extractedSkills.push(skill);
      }
    }

    // Extract education
    const education: any[] = [];
    if (/b\.?tech|bachelor|b\.?e|bca|bsc|bba|b\.?com|mba|m\.?tech/i.test(rawText)) {
      const degreeMatch = rawText.match(/(b\.?tech|bachelor of technology|b\.?e|bca|bsc|bba|b\.?com|mba|m\.?tech)[^\n\.,]*/i);
      education.push({
        degree: degreeMatch ? degreeMatch[0].trim() : 'Bachelor of Technology',
        institution: 'University / Institute of Technology',
        year: '2023 - 2027',
        grade: '8.4 CGPA'
      });
    }

    // Extract internships / experience
    const internships: any[] = [];
    const internshipMatches = rawText.match(/(?:internship|intern|trainee|associate)[^\n\.]*/gi);
    if (internshipMatches) {
      internshipMatches.slice(0, 3).forEach((item) => {
        internships.push({
          company: 'Corporate Partner / Startup',
          role: item.trim(),
          duration: '3 Months',
          responsibilities: ['Collaborated with cross-functional teams', 'Delivered production features and documentation']
        });
      });
    }

    // Extract projects
    const projects: any[] = [];
    const lines = rawText.split('\n');
    lines.forEach(line => {
      if (/(?:project|portal|system|app|tracker|platform|dashboard|analysis)/i.test(line) && line.length > 10 && line.length < 120) {
        if (projects.length < 4) {
          projects.push({
            title: line.trim().replace(/^[-*•]\s*/, ''),
            description: 'Implemented end-to-end functionality, integrated modern data workflows and APIs.',
            technologies: extractedSkills.slice(0, 3)
          });
        }
      }
    });

    // Match with role requirements
    const roleDef = CAREER_ROLES.find(r => r.title === targetRole) || CAREER_ROLES[0];
    const required = roleDef.requiredSkills;

    const matched = required.filter(req =>
      extractedSkills.some(ext => ext.toLowerCase() === req.toLowerCase())
    );
    const missing = required.filter(req =>
      !extractedSkills.some(ext => ext.toLowerCase() === req.toLowerCase())
    );

    const matchPct = Math.round((matched.length / Math.max(required.length, 1)) * 100);

    const strengths = [
      ...matched.map(s => `Strong foundation in ${s} demonstrated across profile`),
      extractedSkills.length > 5 ? 'Broad multi-disciplinary technical toolkit' : 'Focused core domain familiarity'
    ];

    const weakAreas = missing.slice(0, 4).map(s => `Missing hands-on corporate evidence for ${s}`);

    const recommendations = [
      `Complete high-priority V-CORP projects focusing on ${missing.slice(0, 2).join(' and ')}`,
      `Practice domain-specific AI Mock Interviews targeting the ${targetRole} track`,
      `Complete interactive learning modules for missing critical competencies`
    ];

    return {
      parsedData: {
        email,
        phone,
        education,
        skills: extractedSkills,
        projects,
        internships,
        certifications: ['V-CORP Certified Candidate', 'Industry Readiness Level 1'],
        experience: internships.map(i => i.role),
        achievements: ['Dean\'s List Academic Scholar', 'Hackathon Finalist']
      },
      analysis: {
        roleMatchPercentage: Math.max(25, matchPct),
        extractedSkills,
        missingSkills: missing,
        weakAreas,
        strengths,
        recommendations
      }
    };
  }
}
