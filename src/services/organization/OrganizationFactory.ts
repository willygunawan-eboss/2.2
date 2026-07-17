import { OrganizationRepositoryImpl } from "./repository/OrganizationRepositoryImpl.js";
import { OrganizationApplicationService } from "./application/OrganizationApplicationService.js";
import { MoveOrganizationUseCase } from "./application/MoveOrganizationUseCase.js";
import { OrganizationQueryService } from "./application/OrganizationQueryService.js";
import { EventPublisherImpl } from "./infrastructure/EventPublisherImpl.js";
import { TimelineServiceImpl } from "./infrastructure/TimelineServiceImpl.js";
import { AuditServiceImpl } from "./infrastructure/AuditServiceImpl.js";

const repository = new OrganizationRepositoryImpl();
const eventPublisher = new EventPublisherImpl();
const timelineService = new TimelineServiceImpl();
const auditService = new AuditServiceImpl();

export const organizationApplicationService = new OrganizationApplicationService(
  repository,
  eventPublisher,
  timelineService,
  auditService
);

export const moveOrganizationUseCase = new MoveOrganizationUseCase(
  repository,
  eventPublisher,
  timelineService,
  auditService
);

export const organizationQueryService = new OrganizationQueryService(repository);
