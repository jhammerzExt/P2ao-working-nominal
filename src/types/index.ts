export type ModuleType = 
  | 'war-room'
  | 'browser'
  | 'functions'
  | 'chat'
  | 'termux'
  | 'scratchpad'
  | 'hitl'
  | 'music'
  | 'video'
  | 'image'
  | 'search'
  | 'maps'
  | 'transcribe'
  | 'live'
  | 'vault'
  | 'github'
  | 'osint'
  | 'burner-mail'
  | 'projects'
  | 'presets'
  | 'audit'
  | 'swarm-test'
  | 'packager'
  | 'drive'
  | 'knowledge-graph'
  | 'tool-shed'
  | 'autonomy-supervisor'
  | 'download-models'
  | 'universal-installer';

export type ChatModel =
  | 'gemini-3.8-flash'
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'aurelius-teraflop-omega'
  | 'sovereign-engineer-core'
  | 'manus-ai-co-architect'
  | 'lysander-30-cbp'
  | 'colonel-ro-private-ghost'
  | 'gemini-swarm-38-omni'
  | 'omniscient-post-human-ai'
  | 'aurelius-teraflop-super-agent'
  | 'lysander-3.0-engine'
  | 'lysander-3.1-enterprise'
  | 'llama-3.3-70b-instruct'
  | 'qwen-2.5-72b-instruct'
  | 'mistral-large-2411'
  | 'gemma-2-27b-it'
  | 'deepseek-v3';

export interface AgentModelSpec {
  id: string;
  code: string;
  name: string;
  role: string;
  sector: string;
  node_id: string;
  clearance: string;
  teraflops: number;
  highestTierModel: string;
  secondaryModel: string;
  system_prompt: string;
  motto: string;
  voice: string;
  badge: string;
  capabilities: string[];
}

export interface ScratchpadItem {
  id: string;
  userId?: string;
  title: string;
  category: 'working-memory' | 'semantic-cache' | 'directives' | 'hfid-dossier' | 'code-drafts';
  content: string;
  tags: string[];
  hfidHash?: string;
  attested: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HITLWorkflowDirective {
  id: string;
  title: string;
  source: string;
  type: 'CODE_DEPLOY' | 'MODEL_DISPATCH' | 'SWARM_ESCALATION' | 'MUTATE_SIGNAL' | 'VAULT_SEAL';
  proposedBy: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MUTATED';
  riskScore: 'LOW' | 'MEDIUM' | 'CRITICAL_HIGH';
  hfidAttested: boolean;
  hfidSignature?: string;
  details: string;
  payload: Record<string, any>;
  createdAt: string;
  resolvedAt?: string;
  executionState?: 'PENDING' | 'EXECUTING' | 'IMPLEMENTED' | 'FAILED' | 'REVOKED';
  executionOutput?: string;
  executionLogs?: string[];
}

export interface SuperAgentCommand {
  protocol: 'HEO' | 'HFID' | 'Integrated Feedback' | 'RING_-3' | 'SWARM_DISPATCH';
  action: string;
  payload: Record<string, any>;
  teraflopsRating?: number;
  hashAttestation?: string;
}

export interface MediaAttachmentItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  model?: string;
  timestamp: string;
  mediaAttachment?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    fileName: string;
    mimeType: string;
  };
  mediaAttachments?: MediaAttachmentItem[];
  groundingData?: any;
  thoughtContent?: string;
  thoughtDurationSeconds?: number;
  thoughtLines?: string[];
  deepThinkTrace?: DeepThinkTrace | any;
  superAgentMetrics?: {
    teraflops: number;
    tokensBurned: number;
    schemaValid: boolean;
    reasoningSteps?: string[];
  };
  toolInvocation?: {
    toolId: string;
    toolName: string;
    args: Record<string, any>;
    result: any;
    elapsedMs: number;
    proofHash: string;
  };
  autonomousDirectiveResults?: Array<{
    tag: string;
    action: string;
    success: boolean;
    summary: string;
    output?: any;
  }>;
}

export interface Artifact {
  id: string;
  type: 'music' | 'image' | 'video' | 'transcription' | 'knowledge' | 'dossier' | 'chat';
  title: string;
  prompt: string;
  model: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
  metadataJson?: string;
  createdAt: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  createdAt: string;
}

export interface LysanderSkill {
  id: string;
  code: string;
  name: string;
  engine: 'LYSANDER_3.0_CBP' | 'LYSANDER_3.1_ENTERPRISE' | 'LYSANDER_4.0_DEEPMIND';
  category: 'CONSENSUS' | 'COGNITION' | 'HEALING' | 'PROVENANCE' | 'HARDWARE' | 'ESOTERIC';
  status: 'EMBODIED' | 'AUTONOMOUS' | 'ACTIVE_NOMINAL';
  latencyProfile: string;
  governance: 'HFID_100_AND_JHAMMERZ';
  description: string;
  mechanism: string;
  tacticalAdvantage: string;
  parametersSchema: Record<string, any>;
  lastAttestationHash?: string;
}

export interface DeepThinkStep {
  phase: 'DECOMPOSITION' | 'COUNTERFACTUAL_SEARCH' | 'HEURISTIC_PRUNING' | 'INVARIANT_CHECK' | 'SYNTHESIS';
  title: string;
  reasoning: string;
  confidence: number;
  durationMs: number;
}

export interface DeepThinkTrace {
  problemStatement: string;
  recursiveDepth: number;
  branchesEvaluated: number;
  steps: DeepThinkStep[];
  synthesizedAxiom: string;
  lossDelta: number;
  totalDurationMs: number;
  timestamp: string;
}

export interface LearnedAxiom {
  id: string;
  topic: string;
  axiom: string;
  confidence: number;
  epoch: number;
  timestamp: string;
  sourceContext?: string;
  lossValue: number;
}

export interface RecursiveTrainingState {
  status: 'CHILLING_AND_TRAINING' | 'ACTIVE_INFERENCE' | 'CRYSTALLIZING_WEIGHTS' | 'PAUSED';
  isIdle: boolean;
  epoch: number;
  loss: number;
  lossHistory: number[];
  gradientNorm: number;
  learningRate: number;
  recursiveDepth: number;
  weightsCrystallized: number;
  totalCapacityWeights: number;
  dataSamplesIngested: number;
  currentFocusTopic: string;
  recentLearnedAxioms: LearnedAxiom[];
  idleElapsedSeconds: number;
  syntheticTriplesCount: number;
}

export interface LysanderExecutionResult {
  success: boolean;
  skillId: string;
  skillName: string;
  engine: string;
  executionProof: string;
  hfidSignature: string;
  zenodoReference: string;
  trace: string[];
  timestamp: string;
  elapsedMs: number;
  tokensBurned: number;
  teraflopsRating: number;
  invariantStatus: string;
}

export interface SovereignFunctionParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  description: string;
}

export interface SovereignFunction {
  id: string;
  name: string;
  category: 'file' | 'build' | 'tool-forge' | 'swarm' | 'security' | 'compendium' | 'sovereign';
  description: string;
  parameters: SovereignFunctionParam[];
  examples?: Array<{ label: string; args: Record<string, any> }>;
}

export interface FunctionCallRequest {
  functionId: string;
  args: Record<string, any>;
  agentId?: string;
}

export interface FunctionExecutionResult {
  id: string;
  functionId: string;
  agentId: string;
  args: Record<string, any>;
  success: boolean;
  output?: any;
  error?: string;
  stdout?: string;
  stderr?: string;
  diff?: string;
  proofHash: string;
  elapsedMs: number;
  tokensBurned: 0;
  timestamp: string;
}

export interface AutonomousAgentPlanStep {
  stepIndex: number;
  functionId: string;
  description: string;
  args: Record<string, any>;
  status: 'PENDING' | 'EXECUTING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';
  result?: FunctionExecutionResult;
}

export interface AutonomousTaskPlan {
  id: string;
  directive: string;
  agentId: string;
  status: 'PLANNING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  steps: AutonomousAgentPlanStep[];
  overallSummary?: string;
  proofHash: string;
  totalElapsedMs: number;
  timestamp: string;
}

export interface AuditLedgerItem {
  id: string;
  timestamp: string;
  subsystem: string;
  action: string;
  payload: Record<string, any>;
  result: any;
  proofHash: string;
  status: 'SUCCESS' | 'FAILED' | 'HEALED';
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'architecture' | 'context' | 'directive' | 'blueprint' | 'osint' | 'axiom';
  summary: string;
  details: string;
  connections: string[];
  confidence: number;
  updatedAt: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export interface MicroTool {
  id: string;
  name: string;
  description: string;
  language: 'javascript' | 'typescript' | 'python' | 'regex';
  code: string;
  defaultInput: string;
  author: string;
  usageCount: number;
  category: 'string' | 'crypto' | 'network' | 'data' | 'utility' | 'sovereign' | 'stealth' | 'hypervisor' | 'behavioral' | 'refactor';
  endpoint?: string;
  useCase?: string;
  createdAt: string;
}

export interface AutonomyDiagnostic {
  id: string;
  timestamp: string;
  category: 'DATABASE' | 'MEMORY' | 'ARTIFACTS' | 'HYPERVISOR' | 'LLM_GATEWAY' | 'AUTONOMY';
  testName: string;
  status: 'PASSED' | 'OPTIMIZED' | 'WARNING' | 'HEALED' | 'UNLOCKED';
  details: string;
  actionTaken?: string;
  proofHash: string;
}



