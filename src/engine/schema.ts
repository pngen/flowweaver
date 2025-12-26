import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  handler: z.string(),
  inputs: z.record(z.any()).optional(),
  outputs: z.record(z.any()).optional(),
  dependencies: z.array(z.string()).optional()
});

export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  tasks: z.array(TaskSchema)
});

export const RunRequestSchema = z.object({
  workflowId: z.string(),
  idempotencyKey: z.string().optional(),
  parameters: z.record(z.any()).optional()
});

export type Task = z.infer<typeof TaskSchema>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
export type RunRequest = z.infer<typeof RunRequestSchema>;

export const WorkflowDefinition = WorkflowDefinitionSchema;
export const RunRequest = RunRequestSchema;