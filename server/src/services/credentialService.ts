import { v4 as uuidv4 } from 'uuid';
import { Certificate } from '../models/Certificate';
import { Badge } from '../models/Badge';
import { StudentProfile } from '../models/StudentProfile';
import { BADGES_CATALOG } from '../shared/constants';
import { SocketService } from './socketService';

export class CredentialService {
  static async issueTaskCredential(
    userId: string,
    studentName: string,
    role: string,
    projectName: string,
    taskTitle: string,
    score: number,
    skills: string[]
  ) {
    const credentialId = `VCORP-TASK-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationUrl = `/verify/certificate/${credentialId}`;

    const cert = await Certificate.create({
      credentialId,
      type: 'task_credential',
      userId,
      studentName,
      title: `Verified Task Competency: ${taskTitle}`,
      role,
      projectName,
      taskTitle,
      skills,
      score,
      issuedDate: new Date(),
      verificationUrl,
      qrCodeUrl: verificationUrl,
      metadata: { taskCompleted: true, verifiedByAI: true }
    });

    // Reward XP
    await StudentProfile.findOneAndUpdate(
      { userId },
      { $inc: { xp: 150 } }
    );

    await SocketService.sendNotificationToUser(userId, {
      type: 'certificate_issued',
      title: 'New Verified Task Credential Issued! 📜',
      message: `You earned a verifiable task credential for "${taskTitle}".`,
      link: '/credentials'
    });

    return cert;
  }

  static async issueProjectCertificate(
    userId: string,
    studentName: string,
    role: string,
    projectName: string,
    score: number,
    skills: string[]
  ) {
    const credentialId = `VCORP-PROJ-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationUrl = `/verify/certificate/${credentialId}`;

    const cert = await Certificate.create({
      credentialId,
      type: 'project_certificate',
      userId,
      studentName,
      title: `V-CORP Project Completion Certificate: ${projectName}`,
      role,
      projectName,
      skills,
      score,
      issuedDate: new Date(),
      verificationUrl,
      qrCodeUrl: verificationUrl,
      metadata: { projectCompleted: true, distinctionScore: score }
    });

    // Reward XP & Level check
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $inc: { xp: 500 } },
      { new: true }
    );

    if (profile && profile.xp >= profile.level * 1000) {
      profile.level += 1;
      await profile.save();
    }

    // Award badge if first project
    await this.unlockBadge(userId, 'first-project');

    await SocketService.sendNotificationToUser(userId, {
      type: 'certificate_issued',
      title: 'Project Certificate Earned! 🏆',
      message: `Congratulations! You received a Project Completion Certificate for "${projectName}".`,
      link: '/credentials'
    });

    return cert;
  }

  static async unlockBadge(userId: string, badgeId: string) {
    const badgeDef = BADGES_CATALOG.find(b => b.id === badgeId);
    if (!badgeDef) return null;

    const existing = await Badge.findOne({ userId, badgeId });
    if (existing) return existing;

    const badge = await Badge.create({
      userId,
      badgeId,
      title: badgeDef.title,
      description: badgeDef.description,
      icon: badgeDef.icon,
      category: badgeDef.category,
      unlockedAt: new Date()
    });

    // Reward XP
    await StudentProfile.findOneAndUpdate(
      { userId },
      { $inc: { xp: 100 } }
    );

    await SocketService.sendNotificationToUser(userId, {
      type: 'badge_unlocked',
      title: `Badge Unlocked: ${badgeDef.title} ${badgeDef.icon}`,
      message: badgeDef.description,
      link: '/credentials'
    });

    return badge;
  }
}
