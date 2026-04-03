# AI Claude Code 编译指南

> 本项目是对 Anthropic Claude Code CLI 的逆向工程实现，预配置使用 AceData 云端 API 代理。支持终端交互式 AI 编程，内置聊天界面和 API 密钥管理功能。

---

[中文 README](README_zh.md) | [English README](README.md)

## 📖 文档导航

- **[Learn_Claude_Code.md](docs/Learn_Claude_Code.md)** - 深入学习 Claude Code 架构与 Agent 原理
- **[Claude_Research.md](docs/Claude_Research.md)** - 源码快照研究背景与安全分析
- **[AI_Reimplementation.md](docs/AI_Reimplementation.md)** - AI 重新实现的法律与伦理讨论
- **[testing-spec.md](docs/testing-spec.md)** - 测试规范文档
- **[REVISION-PLAN.md](docs/REVISION-PLAN.md)** - 项目修订计划

---

## 🚀 快速开始

### 前置要求

- **Bun** >= 1.2.0（必需）
- Git

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/larack8/claw-code-cli
cd claw-code-cli

# 安装依赖
bun install

# 构建项目
bun run build

# 运行开发模式
bun run dev

# 或直接运行 CLI
./dist/cli.js
```

![run.png](images/run.png)

---

## 🔑 API 密钥配置

本项目预配置使用 **AceData Cloud** API 代理访问 Anthropic Claude。

### 方式一：通过 settings.json 配置（推荐）

编辑 `~/.claude/settings.json`（不存在则创建）：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的API令牌",
    "ANTHROPIC_BASE_URL": "https://api.acedata.cloud"
  }
}
```

### 方式二：环境变量

运行前设置环境变量：

```bash
# Linux / macOS
export ANTHROPIC_AUTH_TOKEN="你的API令牌"
export ANTHROPIC_BASE_URL="https://api.acedata.cloud"
./dist/cli.js

# Windows PowerShell
$env:ANTHROPIC_AUTH_TOKEN="你的API令牌"
$env:ANTHROPIC_BASE_URL="https://api.acedata.cloud"
.\dist\cli.js
```

### 方式三：应用内配置命令

启动 CLI 后，输入 `/api-setup` 打开 API 配置向导。

### 如何获取 API 令牌

1. 访问 [AceData Cloud](https://acedata.cloud)
2. 注册/登录账号
3. 进入 API Keys 管理页面
4. 创建新的 API 密钥
5. 复制令牌并按上述方式配置

---

## 📦 编译为二进制可执行程序

将项目编译为独立的二进制文件，无需安装 Bun 即可运行。

### 快速编译（当前平台）

```bash
bun run build:binary
```

### 各平台专用编译命令

```bash
# Windows（生成 .exe）
bun run build:win

# macOS
bun run build:macos

# Linux
bun run build:linux
```

编译后的二进制文件位于 `build/` 目录：
- Windows: `build/claude-js.exe`
- macOS: `build/claude-js-macos`
- Linux: `build/claude-js-linux`

### 跨平台编译说明

> **重要提示**：Bun 的 `--compile` 标志可创建独立可执行文件，但**跨平台编译支持有限**。建议在目标平台上编译：
> - 在 Windows 机器上编译 Windows `.exe`
> - 在 macOS 机器上编译 macOS 二进制文件
> - 在 Linux 机器或 WSL2 中编译 Linux 二进制文件

### 运行二进制文件

```bash
# 编译后可直接运行（无需安装 Bun）：

# Windows
.\build\claude-js.exe

# macOS / Linux（先添加执行权限）
chmod +x build/claude-js-macos
./build/claude-js-macos
```

---

## 📋 项目概述

### 项目信息

| 项目       | 说明                                              |
|----------|-------------------------------------------------|
| **名称**   | `claude-js`                                     |
| **版本**   | `1.0.3`                                         |
| **描述**   | 逆向工程的 Anthropic Claude Code CLI — 终端交互式 AI 编码助手 |
| **模块类型** | ESModule (`"type": "module"`)                   |
| **运行引擎** | Bun >= 1.2.0                                    |
| **入口命令** | `claude-js` → `dist/cli.js`                     |
| **API 提供商** | AceData Cloud (`https://api.acedata.cloud`)  |

### 背景说明

Claude Code 的源码快照仅包含 `src/` 目录和 `README.md`，缺少所有构建配置文件。本项目通过补充必要的配置文件，成功恢复了完整的构建环境，并添加了 AceData Cloud 代理的 API 密钥配置支持。

---

## 📁 项目结构

![cc.png](images/cc.png)

```
claw-code-cli/
├── src/                    # 源代码目录
│   ├── entrypoints/
│   │   └── cli.tsx         # CLI 入口文件
│   └── commands/
│       └── api-setup/      # API 配置 UI 命令
│           └── api-setup.tsx
├── packages/               # Workspace 包
│   ├── audio-capture-napi/
│   ├── color-diff-napi/
│   ├── image-processor-napi/
│   ├── modifiers-napi/
│   └── url-handler-napi/
├── docs/                  # 文档目录
│   ├── Learn_Claude_Code.md
│   ├── Claude_Research.md
│   ├── AI_Reimplementation.md
│   ├── testing-spec.md
│   └── ... 更多文档
├── build/                  # 二进制输出目录（build:binary 后生成）
├── dist/                   # JS 打包输出目录
├── docs/                   # 文档目录
├── build.ts                # 构建脚本
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── biome.json              # Biome 代码格式化配置
├── knip.json               # 未使用代码检查配置
└── mint.json               # Mintlify 文档配置
```

---

## 🛠️ 可用脚本命令

| 命令                     | 说明                        |
|------------------------|---------------------------|
| `bun run build`        | 构建项目 JS 包（执行 `build.ts`）   |
| `bun run build:binary` | 编译当前平台的独立可执行文件            |
| `bun run build:win`    | 编译 Windows `.exe` 二进制文件   |
| `bun run build:macos`  | 编译 macOS 二进制文件            |
| `bun run build:linux`  | 编译 Linux 二进制文件            |
| `bun run dev`          | 开发模式（执行 `scripts/dev.ts`） |
| `bun test`             | 运行测试                      |
| `bun run lint`         | 代码检查                      |
| `bun run lint:fix`     | 自动修复代码问题                  |
| `bun run format`       | 格式化代码                     |
| `bun run check:unused` | 检查未使用的代码                  |
| `bun run health`       | 健康检查                      |
| `bun run docs:dev`     | 启动文档开发服务器                 |

---

## 🔧 核心配置文件

### 1. package.json

项目的核心配置文件，定义了：

- **包名**: `claude-js`
- **版本**: `1.0.3`
- **入口点**: `src/entrypoints/cli.tsx`
- **构建产物**: `dist/cli.js`
- **二进制产物**: `build/claude-js[.exe]`
- **工作空间**: 支持 monorepo 结构

### 2. tsconfig.json

TypeScript 编译配置：

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

自定义构建脚本，使用 Bun 的原生打包功能：

- 清理输出目录
- 使用 `Bun.build()` 打包
- 支持代码分割（splitting）
- 后处理：替换 `import.meta.require` 以兼容 Node.js

### 4. ~/.claude/settings.json

用户设置文件，用于 API 配置：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的令牌",
    "ANTHROPIC_BASE_URL": "https://api.acedata.cloud"
  }
}
```

---

## 📎 核心技术栈

### AI 服务集成

- **Anthropic SDK**: 官方 SDK、Bedrock SDK、Vertex SDK、Agent SDK
- **API 代理**: AceData Cloud (`https://api.acedata.cloud`)
- **云服务 SDK**: AWS SDK (Bedrock)、Azure Identity、Google Auth Library
- **MCP 协议**: `@modelcontextprotocol/sdk` - Model Context Protocol

### 终端 UI

- **React**: 使用 React 进行终端 UI 渲染
- **react-reconciler**: 自定义渲染器
- **chalk**: 终端颜色
- **cli-highlight**: 代码高亮
- **figures**: 终端图标
- **wrap-ansi**: ANSI 文本换行

### 可观测性

- **OpenTelemetry**: 完整的可观测性栈
	- Trace、Metrics、Logs 导出器
	- 支持 OTLP (gRPC/HTTP/Proto)
	- Prometheus 导出器

### 工具库

- **lodash-es**: 实用工具函数
- **zod**: 运行时类型验证
- **yaml**: YAML 解析
- **semver**: 语义化版本
- **diff**: 文本差异对比
- **fuse.js**: 模糊搜索

---

## 🎯 项目特点

1. **基于 Bun 运行时**: 利用 Bun 的高性能和原生 TypeScript 支持
2. **React 终端渲染**: 使用 React 构建终端 UI，提供声明式的交互体验
3. **AceData Cloud 集成**: 预配置使用 AceData Cloud API 代理访问 Claude
4. **API 密钥 UI 管理**: 内置 `/api-setup` 命令用于配置 API 凭证
5. **多云支持**: 支持 Anthropic 直连、AWS Bedrock、Google Vertex、Azure
6. **独立二进制**: 可编译为 Windows、macOS 和 Linux 的单一可执行文件
7. **MCP 协议集成**: 支持 Model Context Protocol
8. **完整可观测性**: 集成 OpenTelemetry，支持分布式追踪和监控
9. **Monorepo 架构**: 使用 workspace 管理多个包
10. **现代工具链**: Biome (格式化/检查)、Knip (死代码检测)

---

## 📑 开发指南

### 构建流程

1. **清理**: 删除旧的 `dist/` 目录
2. **打包**: 使用 `Bun.build()` 打包 TypeScript/TSX
3. **后处理**: 替换 Bun 特定的 API 以兼容 Node.js
4. **二进制**（可选）: 使用 `bun build --compile` 生成独立可执行文件

### 代码质量

- 使用 **Biome** 进行代码格式化和检查
- 使用 **Knip** 检测未使用的代码
- 使用 **TypeScript 6.0.2** 进行类型检查

---

## 🔗 相关资源

- [Anthropic Claude](https://www.anthropic.com/claude)
- [AceData Cloud](https://acedata.cloud)
- [Bun 官方文档](https://bun.sh/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenTelemetry](https://opentelemetry.io/)

---

## ⚠️ 免责声明

本项目是对公开暴露的 Claude Code 源码快照的研究和分析，仅用于教育、安全研究和软件供应链分析目的。详见 [Claude_Research.md](docs/Claude_Research.md)。

---

## 📄 许可证

请参考原始项目的许可证条款。本文档和补充的配置文件遵循相应的开源许可证。
