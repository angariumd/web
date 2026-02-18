# Angarium Dashboard

Management interface for the Angarium Distributed Computing Platform, providing real-time telemetry, job orchestration, and cluster monitoring.

## Capabilities

- **Real-time Telemetry**: Cluster-wide GPU utilization and system memory (RAM) usage monitoring.
- **Cluster Management**: Node registration tracking and health state visualization (READY, BUSY, OFFLINE).
- **Job Orchestration**:
  - Task submission with resource requirements and runtime constraints.
  - Active job tracking and status management.
  - Historical job logs and execution events.
- **Theme Support**: Integrated dark and light mode with dynamic branding assets.

## Technical Details

- **Foundation**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS 4.0.
- **Components**: Radix UI primitives.
- **Icons**: Lucide React.

## Development

### Prerequisites

- Node.js (v18+)
- Active Angarium controller instance

### Installation

```bash
cd web
npm install
```

### Execution

```bash
npm run dev
```

The application serves by default on `http://localhost:5173`.

### Configuration

Configuration is managed via environment variables:

- `VITE_API_URL`: Controller API endpoint (default: `http://localhost:8080/v1`).
- `VITE_API_TOKEN`: Optional bearer token for API authentication.

## Production

Generate an optimized production build:

```bash
npm run build
```

Build artifacts are located in the `dist` directory.
