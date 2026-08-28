import { Request, Response } from 'express';
import { Company } from '../models/Company';
import { MNC_COMPANIES } from '../shared/constants';

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { industry, role } = req.query;
    let query: any = {};
    if (industry) query.industry = new RegExp(String(industry), 'i');
    if (role) query.relevantRoles = String(role);

    let companies = await Company.find(query);
    if (!companies || companies.length === 0) {
      companies = MNC_COMPANIES as any;
    }

    res.json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let company = await Company.findOne({
      $or: [{ companyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!company) {
      const fallback = MNC_COMPANIES.find(c => c.id === id || c.name.toLowerCase().includes(id.toLowerCase()));
      if (fallback) {
        return res.json({ success: true, company: fallback });
      }
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      company
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
