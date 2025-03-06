<div align="center">
  <img src="https://img.quotawish.com/i/2025/02/06/67a4509caefde.png" alt="LeavesWord" width="600"/>

  <h3>Leave words, Embrace worlds 🌍</h3>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PNPM](https://img.shields.io/badge/pnpm-v9.15.4+-%23F69220)](https://pnpm.io/)
  ![Type: ESM](https://img.shields.io/badge/Module-ESM-brightgreen)

  **Next-generation Vocabulary Learning Ecosystem**
</div>

---

## 🌟 Introduction

**LeavesWord** is a modern vocabulary learning platform designed to revolutionize language acquisition through three core components:

- **CMS**: Content Management System for course administration
- **View**: Frontend learning interface
- **Ends**: API & backend services

**Live Demos**
📚 Learning Portal: [app.leaf.quotawish.com](https://app.leaf.quotawish.com)
🌐 Official Site: [leaf.quotawish.com](https://leaf.quotawish.com)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PNPM 9.15.4+

```bash
# Clone repository
git clone https://github.com/your-org/leaves-word.git
cd leaves-word

# Install dependencies
pnpm install
```

### Development Workflow
```bash
# Start CMS
pnpm dev:cms

# Start View Interface
pnpm dev:view

# Start Backend Services
pnpm dev:ends
```

### Production Builds
```bash
# Build all components
pnpm build:all

# Preview production builds
pnpm preview:cms
pnpm preview:view
pnpm preview:ends
```

---

## 🛠️ Project Architecture

```
leaves-word/app
├── app-cms/        # Content Management System
├── app-view/       # Learner Interface
└── app-ends/       # Backend Services & API
```

### Key Scripts
| Command               | Description                          |
|-----------------------|--------------------------------------|
| `pnpm lint:all`       | Run linter across all components     |
| `pnpm format:all`     | Format codebase                      |
| `pnpm test:all`       | Execute test suites                  |
| `pnpm clean:all`      | Remove build artifacts               |

---

## 🔧 Core Technologies

- Modern ESM architecture
- Monorepo pattern with PNPM workspaces
- Automated API generation (`openapi:*` scripts)
- Integrated code quality pipelines

---

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes
4. Push to branch
5. Open Pull Request

Ensure code quality by running:
```bash
pnpm format:all && pnpm lint:all && pnpm test:all
```

---

## 📜 License

Distributed under MIT License. See `LICENSE` for details.

---

<div align="center">
  <br/>
  Crafted with ❤️ by <a href="https://quotawish.com">QuotaWish</a> Team<br/>
  <sub>✨ Where Vocabulary Meets Innovation</sub>
</div>