# AI Claude Code Build Guide

> This document records the complete process of supplementing missing configuration files for the Claude Code source snapshot and successfully compiling and running it.

---

[中文 README.md](README_zh.md) | [English README.md](README.md)

## 📚 Documentation Navigation

- **[README.md](README.md)** - Chinese version (Quick Start & Build Guide)
- **[README_EN.md](README_EN.md)** - This document (English version)
- **[Learn_Claude_Code.md](docs/Learn_Claude_Code.md)** - Deep dive into Claude Code architecture and Agent principles
- **[Claude_Research.md](docs/Claude_Research.md)** - Source snapshot research background and security analysis
- **[AI_Reimplementation.md](docs/AI_Reimplementation.md)** - Legal and ethical discussion on AI reimplementation
- **[testing-spec.md](docs/testing-spec.md)** - Testing specification documentation
- **[REVISION-PLAN.md](docs/REVISION-PLAN.md)** - Project revision plan

---

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.2.0 (required)
- Git

### Installation & Running

```bash
# Clone the repository
git clone https://gitee.com/Larack/ai-cc.git
cd ai-cc

# Install dependencies
bun install

# Build the project
bun run build

# Run in development mode
bun run dev

# Or run CLI directly
./dist/cli.js
```

---

## 📖 Project Overview

### Project Information

| Item | Description |
|------|-------------|
| **Name** | `claude-js` |
| **Version** | `1.0.3` |
| **Description** | Reverse-engineered Anthropic Claude Code CLI — interactive AI coding assistant in the terminal |
| **Module Type** | ESModule (`"type": "module"`) |
| **Runtime Engine** | Bun >= 1.2.0 |
| **Entry Command** | `claude-js` → `dist/cli.js` |
| **Workspaces** | `packages/*` and `packages/@ant/*` |

### Background

The Claude Code source snapshot only contains the `src/` directory and `README.md`, missing all build configuration files. This project successfully restores the complete build environment by supplementing necessary configuration files.

---

## 📦 Project Structure

```
ai-claw-code/
├── src/                    # Source code directory
│   └── entrypoints/
│       └── cli.tsx        # CLI entry file
├── packages/              # Workspace packages
│   ├── audio-capture-napi/
│   ├── color-diff-napi/
│   ├── image-processor-napi/
│   ├── modifiers-napi/
│   └── url-handler-napi/
├── docs/                  # Documentation directory
│   ├── Learn_Claude_Code.md
│   ├── Claude_Research.md
│   ├── AI_Reimplementation.md
│   ├── testing-spec.md
│   └── test-plans/        # Test plans
├── dist/                  # Build output directory
├── build.ts               # Build script
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── biome.json             # Biome code formatting configuration
├── knip.json              # Unused code detection configuration
└── mint.json              # Mintlify documentation configuration
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build the project (executes `build.ts`) |
| `bun run dev` | Development mode (executes `scripts/dev.ts`) |
| `bun test` | Run tests |
| `bun run lint` | Code linting |
| `bun run lint:fix` | Auto-fix code issues |
| `bun run format` | Format code |
| `bun run check:unused` | Check for unused code |
| `bun run health` | Health check |
| `bun run docs:dev` | Start documentation development server |

---

## 🔧 Core Configuration Files

### 1. package.json

The core configuration file that defines:

- **Package name**: `claude-js`
- **Version**: `1.0.3`
- **Entry point**: `src/entrypoints/cli.tsx`
- **Build output**: `dist/cli.js`
- **Workspaces**: Supports monorepo structure

### 2. tsconfig.json

TypeScript compilation configuration:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": false,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["bun"]
  }
}
```

### 3. build.ts

Custom build script using Bun's native bundling capabilities:

- Clean output directory
- Bundle using `Bun.build()`
- Support code splitting
- Post-processing: Replace `import.meta.require` for Node.js compatibility

---

## 📚 Core Technology Stack

### AI Service Integration

- **Anthropic SDK**: Official SDK, Bedrock SDK, Vertex SDK, Agent SDK
- **Cloud Service SDKs**: AWS SDK (Bedrock), Azure Identity, Google Auth Library
- **MCP Protocol**: `@modelcontextprotocol/sdk` - Model Context Protocol

### Terminal UI

- **React**: Terminal UI rendering using React
- **react-reconciler**: Custom renderer
- **chalk**: Terminal colors
- **cli-highlight**: Code highlighting
- **figures**: Terminal icons
- **wrap-ansi**: ANSI text wrapping

### Observability

- **OpenTelemetry**: Complete observability stack
	- Trace, Metrics, Logs exporters
	- Support for OTLP (gRPC/HTTP/Proto)
	- Prometheus exporter

### Utility Libraries

- **lodash-es**: Utility functions
- **zod**: Runtime type validation
- **yaml**: YAML parsing
- **semver**: Semantic versioning
- **diff**: Text diff comparison
- **fuse.js**: Fuzzy search

### Native Modules (Workspace)

- `audio-capture-napi`: Audio capture
- `color-diff-napi`: Color difference calculation
- `image-processor-napi`: Image processing
- `modifiers-napi`: Modifier key handling
- `url-handler-napi`: URL handling

---

## 🎯 Project Features

1. **Bun Runtime Based**: Leverages Bun's high performance and native TypeScript support
2. **React Terminal Rendering**: Build terminal UI using React for declarative interactive experience
3. **Multi-Cloud Support**: Supports Anthropic direct connection, AWS Bedrock, Google Vertex, Azure
4. **MCP Protocol Integration**: Supports Model Context Protocol
5. **Complete Observability**: Integrated OpenTelemetry for distributed tracing and monitoring
6. **Monorepo Architecture**: Manages multiple packages using workspaces
7. **Modern Toolchain**: Biome (formatting/linting), Knip (dead code detection)

---

## 📝 Development Guide

### Build Process

1. **Clean**: Remove old `dist/` directory
2. **Bundle**: Bundle TypeScript/TSX using `Bun.build()`
3. **Post-process**: Replace Bun-specific APIs for Node.js compatibility

### Code Quality

- Use **Biome** for code formatting and linting
- Use **Knip** to detect unused code
- Use **TypeScript 6.0.2** for type checking

### Testing

The project includes comprehensive test plans, see `docs/test-plans/` directory:

- Tool system tests
- Pure function tests
- Context building tests
- Permission system tests
- Model routing tests
- Message handling tests
- Git utility tests
- Configuration settings tests
- CJK truncation tests
- Mock reliability tests
- Integration tests
- CLI coverage baseline

---

## 🔗 Related Resources

- [Anthropic Claude](https://www.anthropic.com/claude)
- [Bun Official Documentation](https://bun.sh/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenTelemetry](https://opentelemetry.io/)

---

## ⚠️ Disclaimer

This project is a research and analysis of the publicly exposed Claude Code source snapshot, intended solely for educational purposes, security research, and software supply chain analysis. See [Claude_Research.md](docs/Claude_Research.md) for details.

---

## 📄 License

Please refer to the original project's license terms. This documentation and supplementary configuration files follow the corresponding open source licenses.
