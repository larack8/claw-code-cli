# AI Claude Code 源码编译指南

> 本文档记录了为 Claude Code 源码快照补充缺失配置文件并成功编译运行的完整过程。

[README.md](README.md) | [Learn_Claude_Code.md](docs/Learn_Claude_Code.md) | [Claude_Research.md](docs/Claude_Research.md) | [AI_Reimplementation.md](docs/AI_Reimplementation.md)

快速下载代码并编译

```
git clone https://gitee.com/Larack/ai-cc.git
cd ai-cc
bun install
bun run build
bun run dev
```

## 概述

Claude Code 的源码快照仅包含 `src/` 目录和 `README.md`，缺少所有构建配置文件。本指南涵盖了从零开始恢复构建环境的全部步骤。

---

## 补充的配置文件

### 1. `package.json`

项目的核心配置文件，定义了：

- **包名**: `@anthropic-ai/claude-code`
- **入口点**: `src/entrypoints/cli.tsx`
- **构建产物**: `dist/cli.js`
- **脚本命令**:
	- `bun install` — 执行安装依赖脚本
	- `bun run build` — 执行构建脚本
	- `bun run dev` — 直接运行源码（开发模式）
	- `bun run typecheck` — TypeScript 类型检查

**依赖项分为三类：**

| 分类                    | 数量    | 示例                                           |
|-----------------------|-------|----------------------------------------------|
| 公开 npm 包              | ~75 个 | `react`, `chalk`, `zod`, `@anthropic-ai/sdk` |
| Anthropic 内部包（需 stub） | ~10 个 | `@ant/*`, `@anthropic-ai/sandbox-runtime`    |
| 开发依赖                  | ~13 个 | `typescript`, `@types/react`, `@types/bun`   |

**详细命令：**

```bash
# Install dependencies
bun install

# Dev mode (runs cli.tsx with MACRO defines injected via -d flags)
bun run dev

# Pipe mode
echo "say hello" | bun run src/entrypoints/cli.tsx -p

# Build (code splitting, outputs dist/cli.js + ~450 chunk files)
bun run build

# Test
bun test                  # run all tests
bun test src/utils/__tests__/hash.test.ts   # run single file
bun test --coverage       # with coverage report

# Lint & Format (Biome)
bun run lint              # check only
bun run lint:fix          # auto-fix
bun run format            # format all src/
```

### 2. `tsconfig.json`

TypeScript 编译配置，关键设置：

- **模块系统**: ESNext + bundler resolution
- **JSX**: `react-jsx`（React 19 的新 JSX 转换）
- **路径别名**: `src/*` → `./src/*`（项目中大量使用 `import from 'src/...'` 格式的导入）
- **目标**: ESNext（Bun 原生支持）
- **类型**: 同时包含 `bun-types` 和 `node` 类型定义



### 步骤 2：执行构建

```bash
bun run build
```

构建脚本将：

1. 初始化 `bun:bundle` feature flag polyfill
2. 注入 `MACRO.*` 构建时常量
3. 为内部 Anthropic 包生成内联 stub
4. 自动检测并 stub 源码快照中缺失的源文件
5. 打包 `src/entrypoints/cli.tsx` 入口点
6. 输出到 `dist/cli.js`（约 11.7 MB）和 `dist/cli.js.map`

### 步骤 3：验证运行

```bash
# 检查版本
bun dist/cli.js --version
# 输出: 1.0.0-research (Claude Code)

# 查看帮助
bun dist/cli.js --help

# 启动交互式界面（需要 API Key）
bun dist/cli.js
```

### 自定义版本号

```bash
CLAUDE_CODE_VERSION=2.0.0 bun run build
```

---

## 构建产物

| 文件                | 大小       | 说明           |
|-------------------|----------|--------------|
| `dist/cli.js`     | ~11.7 MB | 主程序包（ESM 格式） |
| `dist/cli.js.map` | ~38.6 MB | Source Map   |

---

## 技术要点

### 架构概览

```
入口点: src/entrypoints/cli.tsx
    ↓ (动态导入)
主程序: src/main.tsx (Commander.js CLI)
    ↓
终端 UI: src/ink/ (自定义 Ink 实现 + React 19)
    ↓
核心系统:
├── src/tools/      (~40 个工具实现)
├── src/commands/   (~50 个斜杠命令)
├── src/services/   (API、MCP、OAuth、分析)
├── src/hooks/      (权限系统)
└── src/coordinator/ (多智能体协调)
```

### 关键技术栈

| 组件        | 技术                          |
|-----------|-----------------------------|
| 运行时       | Bun                         |
| 语言        | TypeScript (strict)         |
| 终端 UI     | React 19 + 自定义 Ink fork     |
| CLI 框架    | Commander.js 13             |
| Schema 验证 | Zod v3                      |
| 协议        | MCP SDK, LSP                |
| API       | Anthropic SDK               |
| 遥测        | OpenTelemetry 2.x           |
| 布局引擎      | 纯 TypeScript yoga-layout 实现 |

### 注意事项

1. **内部包不可用**：`@ant/*` 系列包和部分 `@anthropic-ai/*` 包不在公共 npm 上发布，相关功能（Chrome
   集成、计算机使用、沙箱运行时等）在此构建中不可用。

2. **Feature Flags 全部禁用**：所有 `bun:bundle` 特性标志默认返回 `false`，这意味着实验性功能（语音、守护进程、协调器模式等）的代码路径已被消除。

3. **需要 API Key 才能实际使用**：虽然 CLI 可以编译和启动（完整的终端 UI、主题选择等均正常），但实际使用需要 Anthropic API
   Key 或 OAuth 登录。

4. **React Reconciler 版本**：项目使用了 `useEffectEvent` Hook，需要 `react-reconciler@0.33.0`（而非 0.31.0），该版本才实现了
   `useEffectEvent` 调度器。

5. **内部包 Stub 需完整方法签名**：某些内部包（如 `@anthropic-ai/sandbox-runtime` 的 `SandboxManager`）的 stub
   需要包含完整的静态方法（如 `isSupportedPlatform`、`checkDependencies`、`wrapWithSandbox`
   等），否则运行时在访问未定义属性时会报错。构建脚本已为所有已知的内部类提供了完整方法签名。

