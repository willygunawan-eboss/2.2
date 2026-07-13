import { db } from "../db/index.js";
import { isNull, sql } from "drizzle-orm";
import * as schema from "../db/schema.js";

// In-memory cache
let orgCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class OrganizationRegistryService {
  static async getRegistry(forceRefresh = false) {
    if (!forceRefresh && orgCache && (Date.now() - cacheTimestamp < CACHE_TTL)) {
      return orgCache;
    }

    const [companies, branches, divisions, departments, sections, teams, positions, jobGrades] = await Promise.all([
      db.select().from(schema.companies).where(isNull(schema.companies.deletedAt)),
      db.select().from(schema.branches).where(isNull(schema.branches.deletedAt)),
      db.select().from(schema.divisions).where(isNull(schema.divisions.deletedAt)),
      db.select().from(schema.departments).where(isNull(schema.departments.deletedAt)),
      db.select().from(schema.sections).where(isNull(schema.sections.deletedAt)),
      db.select().from(schema.teams).where(isNull(schema.teams.deletedAt)),
      db.select().from(schema.positions).where(isNull(schema.positions.deletedAt)),
      db.select().from(schema.jobGrades).where(isNull(schema.jobGrades.deletedAt)),
    ]);

    orgCache = {
      companies,
      branches,
      divisions,
      departments,
      sections,
      teams,
      positions,
      jobGrades,
    };
    cacheTimestamp = Date.now();

    return orgCache;
  }

  static invalidateCache() {
    orgCache = null;
    cacheTimestamp = 0;
  }

  static async getHealth() {
    const registry = await this.getRegistry();
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Check broken relations & orphans
    const companyIds = new Set(registry.companies.map((c: any) => c.id));
    const branchIds = new Set(registry.branches.map((b: any) => b.id));
    const divisionIds = new Set(registry.divisions.map((d: any) => d.id));
    const departmentIds = new Set(registry.departments.map((d: any) => d.id));
    const sectionIds = new Set(registry.sections.map((s: any) => s.id));
    const teamIds = new Set(registry.teams.map((t: any) => t.id));
    const positionIds = new Set(registry.positions.map((p: any) => p.id));
    const jobGradeIds = new Set(registry.jobGrades.map((jg: any) => jg.id));

    // Validations
    registry.branches.forEach((b: any) => {
      if (!companyIds.has(b.companyId)) errors.push(`Branch "\${b.name}" has invalid Company ID.`);
    });

    registry.divisions.forEach((d: any) => {
      if (!branchIds.has(d.branchId)) errors.push(`Division "\${d.name}" has invalid Branch ID.`);
    });

    registry.departments.forEach((d: any) => {
      if (!divisionIds.has(d.divisionId)) errors.push(`Department "\${d.name}" has invalid Division ID.`);
    });

    registry.sections.forEach((s: any) => {
      if (!departmentIds.has(s.departmentId)) errors.push(`Section "\${s.name}" has invalid Department ID.`);
    });

    registry.teams.forEach((t: any) => {
      if (!sectionIds.has(t.sectionId)) errors.push(`Team "\${t.name}" has invalid Section ID.`);
    });

    registry.positions.forEach((p: any) => {
      if (p.departmentId && !departmentIds.has(p.departmentId)) {
        errors.push(`Position "\${p.name}" has invalid Department ID.`);
      }
      if (p.parentPositionId && !positionIds.has(p.parentPositionId)) {
        errors.push(`Position "\${p.name}" has invalid Parent Position ID.`);
      }
      if (p.jobGradeId && !jobGradeIds.has(p.jobGradeId)) {
        errors.push(`Position "\${p.name}" has invalid Job Grade ID.`);
      }
    });

    // Check circular references in positions
    const posMap = new Map(registry.positions.map((p: any) => [p.id, p.parentPositionId]));
    for (const [id, parentId] of posMap.entries()) {
      let current = parentId;
      const visited = new Set([id]);
      while (current) {
        if (visited.has(current)) {
          errors.push(`Circular reference detected in Position ID: \${id}`);
          break;
        }
        visited.add(current);
        current = posMap.get(current);
      }
    }

    // Missing entities
    if (registry.companies.length === 0) warnings.push("Missing Company data.");
    if (registry.branches.length === 0) warnings.push("Missing Branch data.");
    if (registry.departments.length === 0) warnings.push("Missing Department data.");
    if (registry.positions.length === 0) warnings.push("Missing Position data.");

    // Integrity Score
    const totalEntities = registry.companies.length + registry.branches.length + registry.divisions.length +
      registry.departments.length + registry.sections.length + registry.teams.length + registry.positions.length;
    
    const penalty = errors.length * 10 + warnings.length * 2;
    const integrityScore = Math.max(0, 100 - (totalEntities === 0 ? 100 : penalty));

    return {
      integrityScore,
      errors,
      warnings,
      totalEntities,
      healthy: errors.length === 0,
      timestamp: new Date().toISOString()
    };
  }
}
