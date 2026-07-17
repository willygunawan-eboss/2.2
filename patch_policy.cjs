const fs = require('fs');

let file = 'src/services/policy/domain/Policy.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface PolicyProps {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  rules: PolicyRule[];
  defaultEffect: PolicyEffect;
}`,
  `export interface PolicyProps {
  id: string;
  code: string;
  name: string;
  description: string;
  status: PolicyStatus;
  rules: PolicyRule[];
  defaultEffect: PolicyEffect;
}`
);

code = code.replace(
  `public static create(
    id: string | null,
    name: string,
    description: string,
    defaultEffect: PolicyEffect = PolicyEffect.DENY
  ): Policy {
    return new Policy({
      id: id || uuidv4(),
      name,
      description,
      status: PolicyStatus.DRAFT,
      rules: [],
      defaultEffect
    });
  }`,
  `public static create(
    id: string | null,
    code: string,
    name: string,
    description: string,
    defaultEffect: PolicyEffect = PolicyEffect.DENY
  ): Policy {
    return new Policy({
      id: id || uuidv4(),
      code,
      name,
      description,
      status: PolicyStatus.DRAFT,
      rules: [],
      defaultEffect
    });
  }`
);

code = code.replace(`get name(): string { return this.props.name; }`, `get code(): string { return this.props.code; }\n  get name(): string { return this.props.name; }`);

fs.writeFileSync(file, code);


file = 'src/services/policy/repository/IPolicyRepository.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(/findByName/g, 'findByCode');
  fs.writeFileSync(file, code);
}

file = 'src/services/policy/infrastructure/InMemoryPolicyRepository.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(/findByName/g, 'findByCode');
  code = code.replace(/policy\.name === name/g, 'policy.code === name');
  fs.writeFileSync(file, code);
}

file = 'src/services/policy/application/PolicyApplicationService.ts';
if (fs.existsSync(file)) {
  code = fs.readFileSync(file, 'utf8');
  code = code.replace(/name: string;\n  description: string;/g, 'code: string;\n  name: string;\n  description: string;');
  code = code.replace(/Policy\.create\(null, dto\.name,/g, 'Policy.create(null, dto.code, dto.name,');
  code = code.replace(/evaluatePolicyByName/g, 'evaluatePolicyByCode');
  code = code.replace(/findByName\(policyName\)/g, 'findByCode(policyName)');
  code = code.replace(/PolicyNotFoundError\(policyName\)/g, 'PolicyNotFoundError(policyName)');
  fs.writeFileSync(file, code);
}

