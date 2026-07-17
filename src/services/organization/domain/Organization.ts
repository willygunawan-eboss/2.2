import { 
  OrganizationCode, 
  OrganizationName, 
  OrganizationType, 
  HierarchyLevel, 
  OrganizationStatus 
} from "./ValueObjects.js";
import { InvalidOrganizationParentError, CircularDependencyError } from "./OrganizationErrors.js";
import { v4 as uuidv4 } from 'uuid';

export interface OrganizationProps {
  id: string;
  code: OrganizationCode;
  name: OrganizationName;
  type: OrganizationType;
  level: HierarchyLevel;
  parentId: string | null;
  path: string | null;
  status: OrganizationStatus;
  version: number;
}

export class Organization {
  private props: OrganizationProps;

  private constructor(props: OrganizationProps) {
    this.props = props;
  }

  public static create(
    id: string | null,
    codeStr: string,
    nameStr: string,
    typeStr: string,
    parentId: string | null,
    levelNum: number = 0,
    pathStr: string | null = null,
    isActive: boolean = true,
    isDeleted: boolean = false,
    version: number = 1
  ): Organization {
    const props: OrganizationProps = {
      id: id || uuidv4(),
      code: OrganizationCode.create(codeStr),
      name: OrganizationName.create(nameStr),
      type: OrganizationType.create(typeStr),
      level: HierarchyLevel.create(levelNum),
      parentId,
      path: pathStr,
      status: OrganizationStatus.create(isActive, isDeleted),
      version
    };
    return new Organization(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get code(): string { return this.props.code.value; }
  get name(): string { return this.props.name.value; }
  get type(): string { return this.props.type.value; }
  get level(): number { return this.props.level.value; }
  get parentId(): string | null { return this.props.parentId; }
  get path(): string | null { return this.props.path; }
  get isActive(): boolean { return this.props.status.isActive; }
  get isDeleted(): boolean { return this.props.status.isDeleted; }
  get version(): number { return this.props.version; }

  // Business logic methods
  public updateName(newName: string) {
    this.props.name = OrganizationName.create(newName);
  }

  public updateCode(newCode: string) {
    this.props.code = OrganizationCode.create(newCode);
  }

  public updateType(newType: string) {
    this.props.type = OrganizationType.create(newType);
  }

  public deactivate() {
    this.props.status = OrganizationStatus.create(false, this.props.status.isDeleted);
  }

  public activate() {
    this.props.status = OrganizationStatus.create(true, this.props.status.isDeleted);
  }

  
  public restore() {
    this.props.status = OrganizationStatus.create(true, false);
  }

  public markAsDeleted() {
    this.props.status = OrganizationStatus.create(this.props.status.isActive, true);
  }

  public setHierarchy(parent: Organization | null) {
    if (parent) {
      if (parent.isDeleted) {
        throw new InvalidOrganizationParentError("Cannot assign a deleted organization as parent");
      }
      if (!parent.isActive) {
        throw new InvalidOrganizationParentError("Cannot assign an inactive organization as parent");
      }
      if (parent.id === this.id) {
        throw new CircularDependencyError(this.id, parent.id);
      }
      // Assuming path check for circular dependency is done externally or here
      if (parent.path && parent.path.includes(this.id)) {
        throw new CircularDependencyError(this.id, parent.id);
      }
      this.props.parentId = parent.id;
      this.props.level = HierarchyLevel.create(parent.level + 1);
      this.props.path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
    } else {
      this.props.parentId = null;
      this.props.level = HierarchyLevel.create(0);
      this.props.path = null;
    }
  }

  public incrementVersion() {
    this.props.version++;
  }
}
