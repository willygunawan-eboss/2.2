import { PolicyStatus, PolicyEffect, ConditionOperator } from './PolicyEnums';
import { v4 as uuidv4 } from 'uuid';

export type PolicyContext = Record<string, any>;

export interface EvaluationResult {
  isAllowed: boolean;
  effect: PolicyEffect;
  matchedRules: string[];
  messages: string[];
}

export interface PolicyConditionProps {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
}

export class PolicyCondition {
  constructor(public readonly props: PolicyConditionProps) {}

  evaluate(context: PolicyContext): boolean {
    const contextValue = context[this.props.field];
    if (contextValue === undefined) return false;

    switch (this.props.operator) {
      case ConditionOperator.EQUALS:
        return contextValue === this.props.value;
      case ConditionOperator.NOT_EQUALS:
        return contextValue !== this.props.value;
      case ConditionOperator.GREATER_THAN:
        return contextValue > this.props.value;
      case ConditionOperator.LESS_THAN:
        return contextValue < this.props.value;
      case ConditionOperator.GREATER_THAN_OR_EQUALS:
        return contextValue >= this.props.value;
      case ConditionOperator.LESS_THAN_OR_EQUALS:
        return contextValue <= this.props.value;
      case ConditionOperator.CONTAINS:
        if (Array.isArray(contextValue) || typeof contextValue === 'string') {
          return contextValue.includes(this.props.value);
        }
        return false;
      case ConditionOperator.IN:
        if (Array.isArray(this.props.value)) {
          return this.props.value.includes(contextValue);
        }
        return false;
      default:
        return false;
    }
  }
}

export interface PolicyRuleProps {
  id: string;
  name: string;
  description?: string;
  priority: number;
  effect: PolicyEffect;
  conditions: PolicyCondition[];
}

export class PolicyRule {
  constructor(public readonly props: PolicyRuleProps) {}

  evaluate(context: PolicyContext): boolean {
    // A rule matches if ALL of its conditions evaluate to true (AND logic)
    if (this.props.conditions.length === 0) return true; // Default match if no conditions
    return this.props.conditions.every(condition => condition.evaluate(context));
  }
}

export interface PolicyProps {
  id: string;
  code: string;
  name: string;
  description: string;
  status: PolicyStatus;
  rules: PolicyRule[];
  defaultEffect: PolicyEffect;
}

export class Policy {
  private constructor(private readonly props: PolicyProps) {}

  public static create(
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
  }

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get status(): PolicyStatus { return this.props.status; }
  get rules(): PolicyRule[] { return this.props.rules; }
  get defaultEffect(): PolicyEffect { return this.props.defaultEffect; }

  public addRule(ruleProps: Omit<PolicyRuleProps, 'id' | 'conditions'>, conditionsProps: Omit<PolicyConditionProps, 'id'>[]) {
    const conditions = conditionsProps.map(c => new PolicyCondition({ id: uuidv4(), ...c }));
    const rule = new PolicyRule({
      id: uuidv4(),
      conditions,
      ...ruleProps
    });
    this.props.rules.push(rule);
    // Sort rules by priority descending (higher priority evaluated first)
    this.props.rules.sort((a, b) => b.props.priority - a.props.priority);
  }

  public activate() {
    this.props.status = PolicyStatus.ACTIVE;
  }

  public archive() {
    this.props.status = PolicyStatus.ARCHIVED;
  }

  public evaluate(context: PolicyContext): EvaluationResult {
    const matchedRules: string[] = [];
    const messages: string[] = [];

    // Evaluate rules in priority order
    for (const rule of this.props.rules) {
      if (rule.evaluate(context)) {
        matchedRules.push(rule.props.name);
        messages.push(`Matched rule: ${rule.props.name} with effect ${rule.props.effect}`);
        
        // Return the first matching rule's effect
        return {
          isAllowed: rule.props.effect === PolicyEffect.ALLOW,
          effect: rule.props.effect,
          matchedRules,
          messages
        };
      }
    }

    // If no rules match, apply default effect
    messages.push(`No rules matched. Applying default effect: ${this.props.defaultEffect}`);
    return {
      isAllowed: this.props.defaultEffect === PolicyEffect.ALLOW,
      effect: this.props.defaultEffect,
      matchedRules,
      messages
    };
  }
}
