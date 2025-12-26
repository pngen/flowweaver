# Flowweaver

Flowweaver is an event-driven workflow engine with DAG scheduling capabilities. It allows you to define workflows as directed acyclic graphs (DAGs) of tasks, schedule them according to dependencies, and execute them with retry policies and idempotency support.

## Features

- **DAG-based Workflow Definition**: Define workflows using nodes/tasks with dependencies
- **Zod Validation**: Strong typing for workflow definitions and run requests
- **Task Scheduling**: Respects task dependencies through topological sorting
- **Worker Pool**: Thread-based execution model (simulated in this implementation)
- **Retry Policy**: Exponential backoff retry mechanism
- **Idempotency Support**: Prevents duplicate runs with same idempotency key
- **Persistence Interface**: In-memory store included; Redis/Postgres stubs provided
- **REST API**: Register workflows, start runs, get status
- **SSE Streaming**: Real-time event streaming for run progress
- **Observability**: Structured logging and metrics interface

## Installation