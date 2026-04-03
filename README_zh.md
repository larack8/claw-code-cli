# AI Claude Code 源码编译指南

> 本文档记录了为 Claude Code 源码快照补充缺失配置文件并成功编译运行的完整过程。

---

[中文 README.md](README_zh.md) | [English README.md](README.md)

## 📚 文档导航

- **[README.md](README.md)** - 本文档（快速开始与编译指南）
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
git clone https://gitee.com/Larack/ai-cc.git
cd ai-cc

# 安装依赖
bun install

# 构建项目
bun run build

# 运行开发模式
bun run dev

# 或直接运行 CLI
./dist/cli.js
```

---

## 📖 项目概述

### 项目信息

| 项目       | 说明                                              |
|----------|-------------------------------------------------|
| **名称**   | `claude-js`                                     |
| **版本**   | `1.0.3`                                         |
| **描述**   | 逆向工程的 Anthropic Claude Code CLI — 终端交互式 AI 编码助手 |
| **模块类型** | ESModule (`"type": "module"`)                   |
| **运行引擎** | Bun >= 1.2.0                                    |
| **入口命令** | `claude-js` → `dist/cli.js`                     |
| **工作空间** | `packages/*` 和 `packages/@ant/*`                |

### 背景说明

Claude Code 的源码快照仅包含 `src/` 目录和 `README.md`，缺少所有构建配置文件。本项目通过补充必要的配置文件，成功恢复了完整的构建环境。

---

## 📦 项目结构

```
ai-claw-code/
├── src/                    # 源代码目录
│   └── entrypoints/
│       └── cli.tsx        # CLI 入口文件
├── packages/              # Workspace 包
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
│   └── test-plans/        # 测试计划
├── dist/                  # 构建输出目录
├── build.ts               # 构建脚本
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── biome.json             # Biome 代码格式化配置
├── knip.json              # 未使用代码检查配置
└── mint.json              # Mintlify 文档配置
```

---

## 🛠️ 可用脚本命令

| 命令                     | 说明                        |
|------------------------|---------------------------|
| `bun run build`        | 构建项目（执行 `build.ts`）       |
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
		"types": [
			"bun"
		]
	}
}
```

### 3. build.ts

自定义构建脚本，使用 Bun 的原生打包功能：

- 清理输出目录
- 使用 `Bun.build()` 打包
- 支持代码分割（splitting）
- 后处理：替换 `import.meta.require` 以兼容 Node.js

---

## 📚 核心技术栈

### AI 服务集成

- **Anthropic SDK**: 官方 SDK、Bedrock SDK、Vertex SDK、Agent SDK
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

### Native 模块 (Workspace)

- `audio-capture-napi`: 音频捕获
- `color-diff-napi`: 颜色差异计算
- `image-processor-napi`: 图像处理
- `modifiers-napi`: 修饰键处理
- `url-handler-napi`: URL 处理

---

## 🎯 项目特点

1. **基于 Bun 运行时**: 利用 Bun 的高性能和原生 TypeScript 支持
2. **React 终端渲染**: 使用 React 构建终端 UI，提供声明式的交互体验
3. **多云支持**: 支持 Anthropic 直连、AWS Bedrock、Google Vertex、Azure
4. **MCP 协议集成**: 支持 Model Context Protocol
5. **完整可观测性**: 集成 OpenTelemetry，支持分布式追踪和监控
6. **Monorepo 架构**: 使用 workspace 管理多个包
7. **现代工具链**: Biome (格式化/检查)、Knip (死代码检测)

---

## 📝 开发指南

### 构建流程

1. **清理**: 删除旧的 `dist/` 目录
2. **打包**: 使用 `Bun.build()` 打包 TypeScript/TSX
3. **后处理**: 替换 Bun 特定的 API 以兼容 Node.js

### 代码质量

- 使用 **Biome** 进行代码格式化和检查
- 使用 **Knip** 检测未使用的代码
- 使用 **TypeScript 6.0.2** 进行类型检查

### 测试

项目包含完整的测试计划，详见 `docs/test-plans/` 目录：

- 工具系统测试
- 纯函数测试
- 上下文构建测试
- 权限系统测试
- 模型路由测试
- 消息处理测试
- Git 工具测试
- 配置设置测试
- CJK 截断测试
- Mock 可靠性测试
- 集成测试
- CLI 覆盖率基线

---

## 🔗 相关资源

- [Anthropic Claude](https://www.anthropic.com/claude)
- [Bun 官方文档](https://bun.sh/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenTelemetry](https://opentelemetry.io/)

---

## ⚠️ 免责声明

本项目是对公开暴露的 Claude Code
源码快照的研究和分析，仅用于教育、安全研究和软件供应链分析目的。详见 [Claude_Research.md](docs/Claude_Research.md)。

---

## 📄 许可证

请参考原始项目的许可证条款。本文档和补充的配置文件遵循相应的开源许可证。
