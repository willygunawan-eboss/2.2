import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoveOrganizationUseCase } from './MoveOrganizationUseCase';
import { IOrganizationRepository } from '../repository/IOrganizationRepository';
import { Organization } from '../domain/Organization';
import { InvalidOrganizationParentError, CircularDependencyError } from '../domain/OrganizationErrors';

describe('MoveOrganizationUseCase', () => {
  let repository: any;
  let eventPublisher: any;
  let timelineService: any;
  let auditService: any;
  let useCase: MoveOrganizationUseCase;

  beforeEach(() => {
    repository = {
      findById: vi.fn(),
      findDescendants: vi.fn(),
      update: vi.fn(),
      executeInTransaction: vi.fn().mockImplementation(async (cb) => cb(repository))
    };
    eventPublisher = { publish: vi.fn() };
    timelineService = { recordTimeline: vi.fn() };
    auditService = { recordAudit: vi.fn() };

    useCase = new MoveOrganizationUseCase(repository, eventPublisher, timelineService, auditService);
  });

  it('should move an organization and update its descendants', async () => {
    const root = Organization.create('root-1', 'ROOT', 'Root', 'COMPANY', null);
    const orgToMove = Organization.create('org-1', 'ORG', 'Org', 'DEPARTMENT', 'old-parent');
    orgToMove.setHierarchy(Organization.create('old-parent', 'OLD', 'Old', 'DIVISION', 'root-1'));
    
    const newParent = Organization.create('new-parent', 'NEW', 'New', 'DIVISION', 'root-1');
    const child = Organization.create('child-1', 'CHILD', 'Child', 'SECTION', 'org-1');
    child.setHierarchy(orgToMove);

    repository.findById.mockImplementation(async (id: string) => {
      if (id === 'org-1') return orgToMove;
      if (id === 'new-parent') return newParent;
      if (id === 'child-1') return child;
      return null;
    });

    repository.findDescendants.mockResolvedValue([child]);

    const result = await useCase.execute('org-1', 'new-parent', 'admin');

    expect(result.parentId).toBe('new-parent');
    expect(repository.update).toHaveBeenCalledTimes(2); // Once for org, once for child
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      'OrganizationMoved',
      expect.objectContaining({ organizationId: 'org-1', newParentId: 'new-parent' }),
      expect.any(String)
    );
  });

  it('should throw an error if moving to itself', async () => {
    await expect(useCase.execute('org-1', 'org-1', 'admin')).rejects.toThrow(InvalidOrganizationParentError);
  });

  it('should throw an error if moving root', async () => {
    const root = Organization.create('root-1', 'ROOT', 'Root', 'COMPANY', null);
    repository.findById.mockResolvedValue(root);

    await expect(useCase.execute('root-1', 'some-parent', 'admin')).rejects.toThrow(InvalidOrganizationParentError);
  });

  it('should throw an error if moving to descendant (circular)', async () => {
    const orgToMove = Organization.create('org-1', 'ORG', 'Org', 'DEPARTMENT', 'root-1');
    const newParent = Organization.create('new-parent', 'NEW', 'New', 'SECTION', 'org-1'); // Descendant

    repository.findById.mockImplementation(async (id: string) => {
      if (id === 'org-1') return orgToMove;
      if (id === 'new-parent') return newParent;
      return null;
    });

    repository.findDescendants.mockResolvedValue([newParent]);

    await expect(useCase.execute('org-1', 'new-parent', 'admin')).rejects.toThrow(CircularDependencyError);
  });
});
