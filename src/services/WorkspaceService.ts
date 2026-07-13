import { db } from "../db/index.js";
import { isNull, sql } from "drizzle-orm";
import * as schema from "../db/schema.js";

export class WorkspaceService {
  static async getSummary() {
    const counts = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(schema.companies).where(isNull(schema.companies.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.branches).where(isNull(schema.branches.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.divisions).where(isNull(schema.divisions.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.departments).where(isNull(schema.departments.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.sections).where(isNull(schema.sections.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.teams).where(isNull(schema.teams.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.positions).where(isNull(schema.positions.deletedAt)),
      db.select({ count: sql<number>`count(*)` }).from(schema.jobGrades).where(isNull(schema.jobGrades.deletedAt)),
    ]);

    return {
      company: counts[0][0].count,
      branch: counts[1][0].count,
      division: counts[2][0].count,
      department: counts[3][0].count,
      section: counts[4][0].count,
      team: counts[5][0].count,
      position: counts[6][0].count,
      jobGrade: counts[7][0].count,
    };
  }

  static async getReadiness() {
    const summary = await this.getSummary();
    const readiness = {
      company: summary.company > 0,
      branch: summary.branch > 0,
      division: summary.division > 0,
      department: summary.department > 0,
      section: summary.section > 0,
      team: summary.team > 0,
      position: summary.position > 0,
      jobGrade: summary.jobGrade > 0,
    };

    let filledCount = 0;
    const items = Object.values(readiness);
    items.forEach(val => { if (val) filledCount++; });
    const score = Math.round((filledCount / items.length) * 100);

    const recommendations = [];
    if (!readiness.company) recommendations.push('Please setup at least one Company.');
    if (!readiness.branch) recommendations.push('Please setup at least one Branch.');
    if (!readiness.division) recommendations.push('Please setup at least one Division.');
    if (!readiness.department) recommendations.push('Please setup at least one Department.');
    if (!readiness.section) recommendations.push('Please setup at least one Section.');
    if (!readiness.team) recommendations.push('Please setup at least one Team.');
    if (!readiness.position) recommendations.push('Please setup at least one Position.');
    if (!readiness.jobGrade) recommendations.push('Please setup at least one Job Grade.');

    return { readiness, score, recommendations };
  }

  static async getInsight() {
    const warnings: string[] = [];

    // Find divisions without departments
    const emptyDivisions = await db.all(sql`
      SELECT name FROM divisions 
      WHERE id NOT IN (SELECT division_id FROM departments WHERE deleted_at IS NULL)
      AND deleted_at IS NULL
    `);
    emptyDivisions.forEach((d: any) => warnings.push(`Division "${d.name}" has no departments.`));

    // Find branches without divisions
    const emptyBranches = await db.all(sql`
      SELECT name FROM branches 
      WHERE id NOT IN (SELECT branch_id FROM divisions WHERE deleted_at IS NULL)
      AND deleted_at IS NULL
    `);
    emptyBranches.forEach((b: any) => warnings.push(`Branch "${b.name}" has no divisions.`));

    // Find orphan positions
    const orphanPositions = await db.all(sql`
      SELECT name FROM positions
      WHERE (parent_position_id IS NULL AND code != 'CEO')
      AND deleted_at IS NULL
    `);
    orphanPositions.forEach((p: any) => warnings.push(`Position "${p.name}" has no parent position.`));

    // Find positions without job grades
    const noGradePositions = await db.all(sql`
      SELECT name FROM positions
      WHERE job_grade_id IS NULL
      AND deleted_at IS NULL
    `);
    noGradePositions.forEach((p: any) => warnings.push(`Position "${p.name}" has no job grade assigned.`));
    
    // Find empty sections
    const emptySections = await db.all(sql`
      SELECT name FROM sections
      WHERE id NOT IN (SELECT section_id FROM teams WHERE deleted_at IS NULL)
      AND deleted_at IS NULL
    `);
    emptySections.forEach((s: any) => warnings.push(`Section "${s.name}" is empty.`));

    // Find duplicate codes
    const duplicateCodes = await db.all(sql`
      SELECT code, COUNT(*) as count FROM positions
      WHERE deleted_at IS NULL
      GROUP BY code HAVING count > 1
    `);
    duplicateCodes.forEach((d: any) => warnings.push(`Position code "${d.code}" is duplicated.`));

    return warnings;
  }

  static async getTree() {
    // We will build the full tree here. In real world, maybe recursive CTE or lazy loading.
    const [companies, branches, divisions, departments, sections, teams, positions] = await Promise.all([
      db.select().from(schema.companies).where(isNull(schema.companies.deletedAt)),
      db.select().from(schema.branches).where(isNull(schema.branches.deletedAt)),
      db.select().from(schema.divisions).where(isNull(schema.divisions.deletedAt)),
      db.select().from(schema.departments).where(isNull(schema.departments.deletedAt)),
      db.select().from(schema.sections).where(isNull(schema.sections.deletedAt)),
      db.select().from(schema.teams).where(isNull(schema.teams.deletedAt)),
      db.select().from(schema.positions).where(isNull(schema.positions.deletedAt)),
    ]);

    // Build the hierarchical tree
    // Structure: Company -> Branch -> Division -> Department -> Section -> Team -> Position
    // Or we just return lists and build tree in frontend for ease of parsing

    return {
      companies,
      branches,
      divisions,
      departments,
      sections,
      teams,
      positions
    };
  }

  static async getHierarchy() {
    // Parent-child relationships for positions
    const positions = await db.select().from(schema.positions).where(isNull(schema.positions.deletedAt));
    return positions;
  }
}
