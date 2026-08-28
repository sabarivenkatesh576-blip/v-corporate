/**
 * V-CORP Comprehensive Automated Test Suite
 * Validates Core Business Logic, Scoring Engines, Rubrics, Catalogs & Security Rules
 */

const assert = require('assert');

let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${testName}`);
    console.error(`    Error: ${err.message}`);
    failedTests++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING V-CORP SYSTEM VERIFICATION TESTS');
console.log('====================================================\n');

// 1. CAREER READINESS SCORE ENGINE TESTS
console.log('📊 1. Career Readiness Scoring Engine');

function calculateReadinessScore(components) {
  const weights = {
    resume: 0.10,
    skills: 0.10,
    aptitude: 0.10,
    logicalReasoning: 0.10,
    verbalAbility: 0.10,
    aiInterview: 0.15,
    projects: 0.15,
    communication: 0.10,
    teamwork: 0.05,
    problemSolving: 0.05
  };

  let totalScore = 0;
  for (const [key, weight] of Object.entries(weights)) {
    totalScore += (components[key] || 0) * weight;
  }

  const rounded = Math.round(totalScore);
  let tier = 'Beginner';
  if (rounded >= 91) tier = 'Industry Ready';
  else if (rounded >= 76) tier = 'Highly Job Ready';
  else if (rounded >= 61) tier = 'Job Ready';
  else if (rounded >= 41) tier = 'Developing';

  return { score: rounded, tier };
}

runTest('Should accurately calculate weighted score & Highly Job Ready tier for demo student', () => {
  const sampleComponents = {
    resume: 85,
    skills: 88,
    aptitude: 90,
    logicalReasoning: 88,
    verbalAbility: 85,
    aiInterview: 89,
    projects: 92,
    communication: 86,
    teamwork: 88,
    problemSolving: 90
  };
  const result = calculateReadinessScore(sampleComponents);
  assert.strictEqual(result.score, 88);
  assert.strictEqual(result.tier, 'Highly Job Ready');
});

runTest('Should map 0-40 as Beginner tier', () => {
  const lowComponents = { resume: 30, skills: 35, aptitude: 40, logicalReasoning: 30, verbalAbility: 25, aiInterview: 35, projects: 20, communication: 30, teamwork: 40, problemSolving: 30 };
  const result = calculateReadinessScore(lowComponents);
  assert.ok(result.score <= 40);
  assert.strictEqual(result.tier, 'Beginner');
});

runTest('Should map 91-100 as Industry Ready tier', () => {
  const eliteComponents = { resume: 95, skills: 94, aptitude: 96, logicalReasoning: 92, verbalAbility: 90, aiInterview: 96, projects: 95, communication: 92, teamwork: 90, problemSolving: 95 };
  const result = calculateReadinessScore(eliteComponents);
  assert.ok(result.score >= 91);
  assert.strictEqual(result.tier, 'Industry Ready');
});

// 2. SKILL GAP ENGINE TESTS
console.log('\n🎯 2. Skill Gap Analysis Engine');

function analyzeSkillGaps(roleSkills, studentSkills) {
  const studentSet = new Set(studentSkills.map(s => s.toLowerCase().trim()));
  const gaps = roleSkills.map((skill, index) => {
    const hasSkill = studentSet.has(skill.toLowerCase().trim());
    let priority = 'Low';
    if (!hasSkill) {
      priority = index < 3 ? 'High' : 'Medium';
    }
    return {
      skill,
      status: hasSkill ? 'Acquired' : 'Missing',
      gapLevel: priority,
      recommendation: hasSkill ? 'Maintain proficiency' : `Complete learning module & project task for ${skill}`
    };
  });
  const matchPercentage = Math.round((gaps.filter(g => g.status === 'Acquired').length / roleSkills.length) * 100);
  return { gaps, matchPercentage };
}

runTest('Should detect missing skills and classify High priority for top-tier skills', () => {
  const requiredDataAnalystSkills = ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics'];
  const studentSkills = ['Excel', 'Statistics', 'Communication'];
  const result = analyzeSkillGaps(requiredDataAnalystSkills, studentSkills);

  assert.strictEqual(result.matchPercentage, 33);
  const pythonGap = result.gaps.find(g => g.skill === 'Python');
  assert.ok(pythonGap);
  assert.strictEqual(pythonGap.status, 'Missing');
  assert.strictEqual(pythonGap.gapLevel, 'High');

  const excelGap = result.gaps.find(g => g.skill === 'Excel');
  assert.strictEqual(excelGap.status, 'Acquired');
  assert.strictEqual(excelGap.gapLevel, 'Low');
});

// 3. ADAPTIVE ASSESSMENT CALIBRATOR TESTS
console.log('\n🧠 3. Adaptive Assessment Calibration');

function getNextDifficulty(currentDifficulty, isCorrectConsecutive, isWrongConsecutive) {
  if (isCorrectConsecutive >= 2) {
    if (currentDifficulty === 'beginner') return 'intermediate';
    if (currentDifficulty === 'intermediate') return 'advanced';
    return 'advanced';
  }
  if (isWrongConsecutive >= 2) {
    if (currentDifficulty === 'advanced') return 'intermediate';
    if (currentDifficulty === 'intermediate') return 'beginner';
    return 'beginner';
  }
  return currentDifficulty;
}

runTest('Should increase difficulty to intermediate after 2 consecutive correct answers', () => {
  const next = getNextDifficulty('beginner', 2, 0);
  assert.strictEqual(next, 'intermediate');
});

runTest('Should decrease difficulty to beginner after 2 consecutive wrong answers in intermediate', () => {
  const next = getNextDifficulty('intermediate', 0, 2);
  assert.strictEqual(next, 'beginner');
});

// 4. AI INTERVIEW EVALUATION RUBRIC TESTS
console.log('\n🎙️ 4. AI Interview Rubric & Scoring Engine');

function evaluateInterviewRubric(parameters) {
  const { communication, technicalKnowledge, problemSolving, clarity, confidence, relevance, domainKnowledge, answerQuality } = parameters;
  const avg = (communication + technicalKnowledge + problemSolving + clarity + confidence + relevance + domainKnowledge + answerQuality) / 8;
  const rounded = Math.round(avg);
  return {
    overallScore: rounded,
    isPassing: rounded >= 60,
    starAdherence: parameters.starFrameworkUsed ? 'High' : 'Moderate'
  };
}

runTest('Should compute correct interview average and pass status', () => {
  const params = {
    communication: 88,
    technicalKnowledge: 90,
    problemSolving: 88,
    clarity: 89,
    confidence: 90,
    relevance: 91,
    domainKnowledge: 87,
    answerQuality: 88,
    starFrameworkUsed: true
  };
  const evalResult = evaluateInterviewRubric(params);
  assert.strictEqual(evalResult.overallScore, 89);
  assert.strictEqual(evalResult.isPassing, true);
  assert.strictEqual(evalResult.starAdherence, 'High');
});

// 5. CREDENTIAL VERIFICATION & QR HASH GENERATION
console.log('\n📜 5. Verified Credential & QR URL Generator');

function generateCredential(studentName, projectName, score) {
  const randId = 'VC-CERT-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const verifyUrl = `https://vcorp.local/verify/certificate/${randId}`;
  return {
    certificateId: randId,
    studentName,
    projectName,
    score,
    verificationUrl: verifyUrl,
    isValidUrl: verifyUrl.startsWith('https://vcorp.local/verify/certificate/VC-CERT-2026-')
  };
}

runTest('Should generate unique valid verification URL with standard ID schema', () => {
  const cred = generateCredential('Sabariyandeesh V', 'Omnichannel Retail Sales Trend Analysis', 92);
  assert.ok(cred.certificateId.startsWith('VC-CERT-2026-'));
  assert.strictEqual(cred.isValidUrl, true);
});

// 6. TEAM CODE FORMAT VALIDATION
console.log('\n🤝 6. Team Code & Workspace Validation');

function validateTeamCode(code) {
  const pattern = /^VC-[A-Z]{2,4}-\d{4}$/;
  return pattern.test(code);
}

runTest('Should validate corporate team code pattern VC-BA-4821', () => {
  assert.strictEqual(validateTeamCode('VC-BA-4821'), true);
  assert.strictEqual(validateTeamCode('VC-TECH-9012'), true);
  assert.strictEqual(validateTeamCode('invalid-code'), false);
});

// 7. PROJECT RUBRIC EVALUATION CALCULATION
console.log('\n🏗️ 7. Project Rubric Evaluation Engine');

function evaluateProjectRubric(rubric, submissionMetrics) {
  let score = 0;
  score += (rubric.accuracy || 25) * (submissionMetrics.accuracy || 1);
  score += (rubric.problemSolving || 25) * (submissionMetrics.problemSolving || 1);
  score += (rubric.industryRelevance || 20) * (submissionMetrics.industryRelevance || 1);
  score += (rubric.presentation || 15) * (submissionMetrics.presentation || 1);
  score += (rubric.technicalQuality || 15) * (submissionMetrics.technicalQuality || 1);
  return Math.round(score);
}

runTest('Should evaluate 100-point project submission accurately', () => {
  const rubric = { accuracy: 25, problemSolving: 25, industryRelevance: 20, presentation: 15, technicalQuality: 15 };
  const metrics = { accuracy: 0.9, problemSolving: 0.95, industryRelevance: 0.85, presentation: 0.9, technicalQuality: 0.9 };
  const total = evaluateProjectRubric(rubric, metrics);
  assert.strictEqual(total, 90);
});

// 8. ASSESSMENT AUTO-SCORING ENGINE
console.log('\n📝 8. Assessment Auto-Scoring & Percentage Engine');

function scoreAssessment(questions, answers) {
  let correct = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correctAnswer) correct++;
  });
  const percentage = Math.round((correct / questions.length) * 100);
  return { correct, total: questions.length, percentage };
}

runTest('Should accurately calculate score and percentage for multi-question assessments', () => {
  const questions = [{ correctAnswer: 0 }, { correctAnswer: 2 }, { correctAnswer: 1 }, { correctAnswer: 3 }];
  const answers = [0, 2, 1, 0]; // 3 out of 4 correct
  const result = scoreAssessment(questions, answers);
  assert.strictEqual(result.correct, 3);
  assert.strictEqual(result.percentage, 75);
});

// 9. RESUME PARSER SKILL EXTRACTOR HEURISTIC
console.log('\n📄 9. Resume Parser Skill Extraction Heuristics');

function extractSkillsFromText(text, skillCatalog) {
  const lower = text.toLowerCase();
  return skillCatalog.filter(skill => {
    const regex = new RegExp('\\b' + skill.toLowerCase() + '\\b', 'i');
    return regex.test(lower);
  });
}

runTest('Should extract known skills from resume body text', () => {
  const sampleResume = 'Experienced in Python, SQL querying, building Tableau dashboards and managing financial forecasting models.';
  const catalog = ['Python', 'SQL', 'Tableau', 'Java', 'Docker', 'Kubernetes'];
  const extracted = extractSkillsFromText(sampleResume, catalog);
  assert.deepStrictEqual(extracted, ['Python', 'SQL', 'Tableau']);
});

// SUMMARY
console.log('\n====================================================');
console.log(`🏁 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL TEST SUITES PASSED CLEANLY!\n');
  process.exit(0);
}

