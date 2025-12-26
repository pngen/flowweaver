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

```bash
npm install
```

## Running the Server

```bash
# Development mode
npm run dev

# Production build and start
npm run build
npm start
```

## Example Workflow

```json
{
  "id": "example-workflow",
  "tasks": [
    {
      "id": "task1",
      "name": "Fetch Data",
      "handler": "fetch_data",
      "outputs": { "data": "$.result" }
    },
    {
      "id": "task2",
      "name": "Process Data",
      "handler": "process_data",
      "dependencies": ["task1"],
      "inputs": { "source": "$.data" }
    },
    {
      "id": "task3",
      "name": "Save Result",
      "handler": "save_result",
      "dependencies": ["task2"],
      "inputs": { "processed": "$.result" }
    }
  ]
}
```

## API Usage

### Register a Workflow
```bash
curl -X POST http://localhost:3000/workflows \
  -H "Content-Type: application/json" \
  -d '{"id":"example-workflow","tasks":[{"id":"task1","name":"Fetch Data","handler":"fetch_data"}]}'
```

### Start a Run
```bash
curl -X POST http://localhost:3000/runs \
  -H "Content-Type: application/json" \
  -d '{"workflowId":"example-workflow"}'
```

### Get Run Status
```bash
curl http://localhost:3000/runs/<run-id>
```

### Stream Events (SSE)
```bash
curl http://localhost:3000/events/<run-id>
```

## Design Notes

- **Modular Architecture**: Each component is designed to be composable and testable
- **Type Safety**: Full TypeScript support with Zod validation
- **Scalability**: Worker pool architecture supports parallel task execution
- **Resilience**: Built-in retry logic and error handling
- **Observability**: Structured logging and metrics collection points
- **Persistence Abstraction**: Easy to swap in different storage backends

The system is designed to be production-ready with clear separation of concerns, but implemented in a minimal way for demonstration purposes.

## License

MIT License

## Author

Paul Ngen
