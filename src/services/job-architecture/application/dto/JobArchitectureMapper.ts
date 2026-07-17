import { JobFamily } from '../../domain/JobFamily.js';
import { JobGrade } from '../../domain/JobGrade.js';
import { Job } from '../../domain/Job.js';
import { JobFamilyDTO, JobGradeDTO, JobDTO } from './JobArchitectureDTO.js';

export class JobArchitectureMapper {
  static toJobFamilyDTO(domain: JobFamily): JobFamilyDTO {
    return {
      id: domain.id,
      code: domain.code,
      name: domain.name,
      description: domain.description,
      isActive: domain.isActive
    };
  }

  static toJobGradeDTO(domain: JobGrade): JobGradeDTO {
    return {
      id: domain.id,
      code: domain.code,
      name: domain.name,
      level: domain.level,
      description: domain.description,
      isActive: domain.isActive
    };
  }

  static toJobDTO(domain: Job): JobDTO {
    return {
      id: domain.id,
      code: domain.code,
      name: domain.name,
      jobFamilyId: domain.jobFamilyId,
      jobGradeId: domain.jobGradeId,
      description: domain.description,
      isActive: domain.isActive
    };
  }
}
