import { EmploymentRepositoryImpl } from "./repository/EmploymentRepositoryImpl.js";
import { EmploymentApplicationService } from "./application/EmploymentApplicationService.js";
import { EmploymentQueryService } from "./application/EmploymentQueryService.js";
import { EventPublisherImpl } from "./infrastructure/EventPublisherImpl.js";
import { TimelineServiceImpl } from "./infrastructure/TimelineServiceImpl.js";
import { AuditServiceImpl } from "./infrastructure/AuditServiceImpl.js";
import { AssignmentRepositoryImpl } from "./repository/AssignmentRepositoryImpl.js";
import { AssignmentApplicationService } from "./application/AssignmentApplicationService.js";
import { AssignmentQueryService } from "./application/AssignmentQueryService.js";

const repository = new EmploymentRepositoryImpl();
const eventPublisher = new EventPublisherImpl();
const timelineService = new TimelineServiceImpl();
const auditService = new AuditServiceImpl();

export const employmentApplicationService = new EmploymentApplicationService(
  repository,
  eventPublisher,
  timelineService,
  auditService
);

export const employmentQueryService = new EmploymentQueryService(repository);

const assignmentRepository = new AssignmentRepositoryImpl();
export const assignmentApplicationService = new AssignmentApplicationService(
  assignmentRepository,
  eventPublisher,
  timelineService,
  auditService
);
export const assignmentQueryService = new AssignmentQueryService(assignmentRepository);
