# Enterprise Architecture Compliance Report

## Architecture Health Score: 0/100

**Scanned Files:** 300
**Total Violations:** 136

## Technical Debt & Violations

### BusinessErrorChecker
- **/app/applet/src/domain/business-process/engine/Runtime.ts:14** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/domain/business-process/engine/Runtime.ts:48** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/domain/business-process/engine/Runtime.ts:55** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/platform/compliance/rules/BusinessErrorChecker.ts:11** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/platform/compliance/rules/BusinessErrorChecker.ts:13** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/platform/process/CoordinatorResolver.ts:10** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/BranchService.ts:143** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/BranchService.ts:178** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/CompanyService.ts:121** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/CompanyService.ts:155** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:25** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:36** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:41** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:47** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:66** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:73** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:79** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:84** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:97** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/EmployeeService.ts:106** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/accounts-payable/application/coordinators/RecordVendorInvoiceCoordinator.ts:27** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/accounts-receivable/application/coordinators/RecordCustomerInvoiceCoordinator.ts:31** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/accounts-receivable/application/coordinators/RecordCustomerReceiptCoordinator.ts:30** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/api.ts:12** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:26** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:30** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:34** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:35** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:40** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:46** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/EmploymentQueryService.ts:20** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/AssignmentValidator.ts:5** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/AssignmentValidator.ts:6** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/AssignmentValidator.ts:7** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/AssignmentValidator.ts:8** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:6** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:9** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:12** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:15** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:18** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/application/validation/EmploymentValidator.ts:24** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/domain/AssignmentValueObjects.ts:9** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/domain/ValueObjects.ts:6** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/domain/ValueObjects.ts:17** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/domain/ValueObjects.ts:31** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/employment/domain/ValueObjects.ts:45** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/general-ledger/application/FiscalPeriodClosingApplicationService.ts:15** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/general-ledger/application/FiscalPeriodClosingApplicationService.ts:29** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:28** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:44** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:58** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:61** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:69** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:84** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:101** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:116** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:119** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:127** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:142** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:146** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:149** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:166** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:170** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:175** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:192** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:195** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/job-architecture/application/JobArchitectureApplicationService.ts:203** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:42** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:45** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:48** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:56** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:60** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:65** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:66** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:70** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:112** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:113** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:218** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:226** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:250** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/OrganizationEngine.ts:255** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/application/MoveOrganizationUseCase.ts:34** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/application/OrganizationApplicationService.ts:115** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/application/OrganizationService.ts:113** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/domain/ValueObjects.ts:23** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/domain/ValueObjects.ts:44** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/domain/ValueObjects.ts:55** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/validation/OrganizationValidator.ts:11** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/organization/validation/OrganizationValidator.ts:20** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/PositionApplicationService.ts:129** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/PositionQueryService.ts:20** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/validation/PositionValidator.ts:5** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/validation/PositionValidator.ts:6** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/validation/PositionValidator.ts:7** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/application/validation/PositionValidator.ts:11** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/domain/ValueObjects.ts:6** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/domain/ValueObjects.ts:17** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/position/domain/ValueObjects.ts:31** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/workflow/application/WorkflowApplicationService.ts:99** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/workflow/domain/WorkflowDefinition.ts:94** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/workflow/domain/WorkflowDefinition.ts:97** - Throwing generic Error is forbidden. Use specific Domain Errors.
- **/app/applet/src/services/workflow/domain/WorkflowDefinition.ts:104** - Throwing generic Error is forbidden. Use specific Domain Errors.

### HardcodeChecker
- **/app/applet/src/platform/compliance/rules/HardcodeChecker.ts:5** - console.log cannot be used for Auditing
- **/app/applet/src/platform/compliance/rules/HardcodeChecker.ts:12** - console.log cannot be used for Auditing
- **/app/applet/src/platform/compliance/rules/HardcodeChecker.ts:16** - console.log cannot be used for Auditing
- **/app/applet/src/services/employment/infrastructure/AuditServiceImpl.ts:5** - console.log cannot be used for Auditing
- **/app/applet/src/services/position/infrastructure/AuditServiceImpl.ts:4** - console.log cannot be used for Auditing
- **/app/applet/src/services/workflow/application/WorkflowApplicationService.test.ts:39** - Avoid hardcoding Workflow or Policy names as strings
- **/app/applet/src/services/workflow/application/WorkflowApplicationService.test.ts:69** - Avoid hardcoding Workflow or Policy names as strings

### TypeSafetyChecker
- **/app/applet/src/platform/compliance/rules/TypeSafetyChecker.ts:5** - Usage of Promise<any> is forbidden
- **/app/applet/src/platform/compliance/rules/TypeSafetyChecker.ts:12** - Usage of Promise<any> is forbidden
- **/app/applet/src/platform/compliance/rules/TypeSafetyChecker.ts:16** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/document/application/BusinessDocumentQueryService.ts:8** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/document/application/BusinessDocumentQueryService.ts:14** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/HireEmployeeUseCase.ts:18** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/MutateEmployeeUseCase.ts:22** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/TerminateEmployeeUseCase.ts:22** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/TransferEmployeeUseCase.ts:22** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/ports/IWorkforceUnitOfWork.ts:9** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/ports/IWorkforceUnitOfWork.ts:10** - Usage of Promise<any> is forbidden
- **/app/applet/src/services/workforce/application/ports/IWorkforceUnitOfWork.ts:11** - Usage of Promise<any> is forbidden

### LayerChecker
- **/app/applet/src/routes/jobArchitectureRoutes.ts:3** - Presentation layer cannot import Repositories directly
- **/app/applet/src/routes/jobArchitectureRoutes.ts:4** - Presentation layer cannot import Repositories directly
- **/app/applet/src/routes/jobArchitectureRoutes.ts:5** - Presentation layer cannot import Repositories directly
- **/app/applet/src/services/employment/application/AssignmentApplicationService.test.ts:4** - Application layer cannot access Database directly
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:11** - Application layer cannot access Database directly
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:12** - Application layer cannot access Database directly
- **/app/applet/src/services/employment/application/AssignmentApplicationService.ts:13** - Application layer cannot access Database directly
- **/app/applet/src/services/policy/presentation/PolicyRouter.ts:4** - Presentation layer cannot import Repositories directly
- **/app/applet/src/services/position/application/PositionApplicationService.test.ts:4** - Application layer cannot access Database directly
- **/app/applet/src/services/position/application/PositionApplicationService.ts:17** - Application layer cannot access Database directly
- **/app/applet/src/services/position/application/PositionApplicationService.ts:18** - Application layer cannot access Database directly
- **/app/applet/src/services/position/application/PositionApplicationService.ts:19** - Application layer cannot access Database directly
- **/app/applet/src/services/workflow/presentation/WorkflowRouter.ts:4** - Presentation layer cannot import Repositories directly
- **/app/applet/src/services/workforce/presentation/WorkforceRouter.ts:16** - Presentation layer cannot import Repositories directly
- **/app/applet/src/services/workforce/presentation/WorkforceRouter.ts:17** - Presentation layer cannot import Repositories directly

