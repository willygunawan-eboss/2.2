import { PositionRepositoryImpl } from "./repository/PositionRepositoryImpl.js";
import { PositionApplicationService } from "./application/PositionApplicationService.js";
import { PositionQueryService } from "./application/PositionQueryService.js";
import { AuditServiceImpl } from "./infrastructure/AuditServiceImpl.js";
import { TimelineServiceImpl } from "./infrastructure/TimelineServiceImpl.js";
import { EventPublisherImpl } from "./infrastructure/EventPublisherImpl.js";

const positionRepository = new PositionRepositoryImpl();
const eventPublisher = new EventPublisherImpl();
const timelineService = new TimelineServiceImpl();
const auditService = new AuditServiceImpl();

export const positionApplicationService = new PositionApplicationService(
  positionRepository,
  eventPublisher,
  timelineService,
  auditService
);

export const positionQueryService = new PositionQueryService(positionRepository);
