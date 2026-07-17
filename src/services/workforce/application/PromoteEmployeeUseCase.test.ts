import { describe, it, expect, beforeEach } from 'vitest';
import { PromoteEmployeeUseCase } from './PromoteEmployeeUseCase';
import { WorkforceDomainService } from '../domain/WorkforceDomainService';
import { Assignment } from '../../employment/domain/Assignment';
import { Organization } from '../../organization/domain/Organization';
import { Position } from '../../position/domain/Position';

describe('PromoteEmployeeUseCase', () => {
  let unitOfWorkMock: any;
  let eventPublisherMock: any;
  let policyServiceMock: any;
  let workflowServiceMock: any;
  let auditServiceMock: any;
  let timelineServiceMock: any;
  let useCase: PromoteEmployeeUseCase;

  beforeEach(() => {
    unitOfWorkMock = {
      execute: async (fn: any) => {
        return fn({
          employeeRepo: {
            findByEmployeeNumber: async () => ({ id: 'emp-1', employeeNumber: 'E001', status: 'Active' }),
            update: async () => {}
          },
          employmentRepo: {
            findByEmployeeNumber: async () => ({ id: 'empl-1', status: 'Active' })
          },
          assignmentRepo: {
            findByEmploymentId: async () => [
              Assignment.create('asg-1', 'empl-1', 'org-1', 'pos-1', null, null, '2023-01-01')
            ],
            save: async () => {}
          },
          orgRepo: {
            findById: async () => Organization.create('org-2', 'ORG2', 'New Org', 'DEPARTMENT', null)
          },
          posRepo: {
            findById: async () => Position.create('pos-2', 'POS2', 'New Pos', 'comp-1', null, 'FULL_TIME', 'ACTIVE', '2020-01-01')
          }
        });
      }
    };

    eventPublisherMock = {
      publish: async () => {}
    };

    policyServiceMock = {
      evaluatePolicyByCode: async () => ({ isAllowed: true, effect: 'ALLOW' })
    };

    workflowServiceMock = {
      startWorkflowByCode: async () => ({ id: 'wf-1' })
    };

    auditServiceMock = {
      recordAudit: async () => {}
    };

    timelineServiceMock = {
      recordTimeline: async () => {}
    };

    useCase = new PromoteEmployeeUseCase(
      unitOfWorkMock,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      auditServiceMock,
      timelineServiceMock
    );
  });

  it('should promote employee successfully', async () => {
    const result = await useCase.execute({
      employeeNumber: 'E001',
      companyId: 'comp-1',
      newOrganizationId: 'org-2',
      newPositionId: 'pos-2',
      newJobGradeId: 'jg-2',
      effectiveDate: '2023-06-01',
      reason: 'Excellent performance',
      actor: 'HRAdmin'
    });

    expect(result.employeeId).toBe('emp-1');
    expect(result.oldAssignmentId).toBe('asg-1');
    expect(result.newAssignmentId).toBeDefined();
    expect(result.workflowInstanceId).toBe('wf-1');
  });

  it('should throw error if effective date is before current assignment', async () => {
    const errorUseCase = new PromoteEmployeeUseCase(
      {
        execute: async (fn: any) => {
          return fn({
            employeeRepo: { findByEmployeeNumber: async () => ({ id: 'emp-1', employeeNumber: 'E001', status: 'Active' }) },
            employmentRepo: { findByEmployeeNumber: async () => ({ id: 'empl-1', status: 'Active' }) },
            assignmentRepo: {
              findByEmploymentId: async () => [
                Assignment.create('asg-1', 'empl-1', 'org-1', 'pos-1', null, null, '2023-01-01')
              ]
            },
            orgRepo: { findById: async () => Organization.create('org-2', 'ORG2', 'New Org', 'DEPARTMENT', null) },
            posRepo: { findById: async () => Position.create('pos-2', 'POS2', 'New Pos', 'comp-1', null, 'FULL_TIME', 'ACTIVE', '2020-01-01') }
          });
        }
      } as any,
      eventPublisherMock,
      policyServiceMock,
      workflowServiceMock,
      auditServiceMock,
      timelineServiceMock
    );

    await expect(errorUseCase.execute({
      employeeNumber: 'E001',
      companyId: 'comp-1',
      newOrganizationId: 'org-2',
      newPositionId: 'pos-2',
      effectiveDate: '2022-01-01', // Before existing assignment
      reason: 'Promotion',
      actor: 'HRAdmin'
    })).rejects.toThrow("Promotion effective date must be after current assignment effective date");
  });
});
