# CLAUDE.md - eshop_frontend

> **Documentation Version**: 1.0  
> **Last Updated**: 2025-07-16  
> **Project**: eshop_frontend  
> **Description**: Vue3 前端購物網站開發專案 - 基於Vue3的現代化電商前端應用，包含完整的購物流程、會員系統和響應式設計  
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**  
> **Claude Code must explicitly acknowledge these rules at task start**  
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**  
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend  
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**  
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🐙 GITHUB SETUP & AUTO-BACKUP

> **🤖 FOR CLAUDE CODE: When initializing any project, automatically ask about GitHub setup**

### 🎯 **GITHUB SETUP PROMPT** (AUTOMATIC)
> **⚠️ CLAUDE CODE MUST ALWAYS ASK THIS QUESTION when setting up a new project:**

```
🐙 GitHub Repository Setup
Would you like to set up a remote GitHub repository for this project?

Options:
1. ✅ YES - Create new GitHub repo and enable auto-push backup
2. ✅ YES - Connect to existing GitHub repo and enable auto-push backup  
3. ❌ NO - Skip GitHub setup (local git only)

[Wait for user choice before proceeding]
```

### 🚀 **OPTION 1: CREATE NEW GITHUB REPO**
If user chooses to create new repo, execute:

```bash
# Ensure GitHub CLI is available
gh --version || echo "⚠️ GitHub CLI (gh) required. Install: brew install gh"

# Authenticate if needed
gh auth status || gh auth login

# Create new GitHub repository
echo "Enter repository name (or press Enter for current directory name):"
read repo_name
repo_name=${repo_name:-$(basename "$PWD")}

# Create repository
gh repo create "$repo_name" --public --description "Vue3 購物網站 - 基於Claude Code開發" --confirm

# Add remote and push
git remote add origin "https://github.com/$(gh api user --jq .login)/$repo_name.git"
git branch -M main
git push -u origin main

echo "✅ GitHub repository created and connected: https://github.com/$(gh api user --jq .login)/$repo_name"
```

### 🔗 **OPTION 2: CONNECT TO EXISTING REPO**
If user chooses to connect to existing repo, execute:

```bash
# Get repository URL from user
echo "Enter your GitHub repository URL (https://github.com/username/repo-name):"
read repo_url

# Extract repo info and add remote
git remote add origin "$repo_url"
git branch -M main
git push -u origin main

echo "✅ Connected to existing GitHub repository: $repo_url"
```

### 🔄 **AUTO-PUSH CONFIGURATION**
For both options, configure automatic backup:

```bash
# Create git hook for auto-push (optional but recommended)
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Auto-push to GitHub after every commit
echo "🔄 Auto-pushing to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    echo "✅ Successfully backed up to GitHub"
else
    echo "⚠️ GitHub push failed - manual push may be required"
fi
EOF

chmod +x .git/hooks/post-commit

echo "✅ Auto-push configured - GitHub backup after every commit"
```

### 📋 **GITHUB BACKUP WORKFLOW** (MANDATORY)
> **⚠️ CLAUDE CODE MUST FOLLOW THIS PATTERN:**

```bash
# After every commit, always run:
git push origin main

# This ensures:
# ✅ Remote backup of all changes
# ✅ Collaboration readiness  
# ✅ Version history preservation
# ✅ Disaster recovery protection
```

### 🎯 **CLAUDE CODE GITHUB COMMANDS**
Essential GitHub operations for Claude Code:

```bash
# Check GitHub connection status
gh auth status && git remote -v

# Create new repository (if needed)
gh repo create [repo-name] --public --confirm

# Push changes (after every commit)
git push origin main

# Check repository status
gh repo view

# Clone repository (for new setup)
gh repo clone username/repo-name
```

## 🏗️ PROJECT OVERVIEW

### 🎯 **eshop_frontend - Vue3 電商前端專案**

本專案為基於 Vue3 的現代化購物網站前端，採用以下技術架構：

**核心技術棧**：
- **前端框架**：Vue 3 + Composition API
- **UI組件庫**：Vuetify 3
- **狀態管理**：Vuex 4
- **路由管理**：Vue Router 4
- **HTTP客戶端**：Axios
- **建構工具**：Vite

**專案特色**：
- SPA (Single Page Application) 架構
- 響應式設計 (手機優先)
- 現代簡約風格設計
- Google OAuth 第三方登入
- SEO 優化 + Google Analytics 整合

### 🎨 **設計規範**

**色彩主題**：
- 主色調：#FAE6B1 (淺黃)
- 輔助色：#FFA101 (橘黃)
- 輔助色：#B3DEE5 (淺藍)
- 深色：#31525B (深藍灰)

**頁面結構**：
```
/                    # 首頁 (商品展示)
/category/:id        # 商品分類頁
/product/:id         # 商品詳情頁
/cart                # 購物車
/checkout            # 結帳
/user/profile        # 會員中心
/user/orders         # 訂單查詢
/user/login          # 登入
/user/register       # 註冊
```

### 🎯 **DEVELOPMENT STATUS**
- **Setup**: ✅ Completed
- **Core Features**: 🔄 Planning
- **Testing**: ⏸️ Pending
- **Documentation**: ⏸️ Pending

## 📁 **Project Structure Guide**
```
src/main/vue/
├── components/     # 可重用組件
│   ├── common/     # 通用組件 (按鈕、輸入框等)
│   ├── layout/     # 版面組件 (Header、Footer、Sidebar)
│   └── ui/         # UI組件 (卡片、模態框等)
├── views/         # 頁面組件
│   ├── home/      # 首頁相關
│   ├── product/   # 商品相關頁面
│   ├── cart/      # 購物車相關
│   ├── user/      # 會員相關頁面
│   └── admin/     # 管理後台 (如需要)
├── store/         # Vuex 狀態管理
│   ├── modules/   # 模組化 Store
│   │   ├── auth.js    # 認證相關
│   │   ├── cart.js    # 購物車狀態
│   │   ├── product.js # 商品狀態
│   │   └── user.js    # 使用者狀態
│   └── index.js   # Store 主檔案
├── router/        # Vue Router 路由配置
│   ├── index.js   # 主路由檔案
│   └── guards.js  # 路由守衛
├── services/      # API 服務層
│   ├── api.js     # API 基礎配置
│   ├── auth.js    # 認證服務
│   ├── product.js # 商品服務
│   └── user.js    # 使用者服務
├── utils/         # 工具函數
│   ├── helpers.js # 通用輔助函數
│   ├── constants.js # 常數定義
│   └── validators.js # 表單驗證
├── assets/        # 靜態資源
│   ├── styles/    # 樣式檔案
│   │   ├── variables.scss # SCSS 變數
│   │   └── global.scss    # 全域樣式
│   ├── images/    # 圖片資源
│   └── fonts/     # 字型檔案
└── plugins/       # Vue 插件
    ├── vuetify.js # Vuetify 配置
    └── axios.js   # Axios 配置
```

## 📋 NEED HELP? START HERE

### 🚀 **Common Vue3 Commands**
```bash
# Development server
npm run dev

# Build for production  
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type check (if using TypeScript)
npm run type-check

# Preview production build
npm run preview

# Install dependencies
npm install

# Update dependencies
npm update

# Clean install (remove node_modules and package-lock.json)
rm -rf node_modules package-lock.json && npm install
```

### 🛠️ **Development Workflow Commands**
```bash
# Start development with hot reload
npm run dev

# Build and watch for changes
npm run build --watch

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Format code
npm run format

# Fix linting errors
npm run lint:fix
```

### 🚀 **Vue3 Specific Commands**
```bash
# Generate Vue component
vue create component ComponentName

# Add Vue CLI plugin
vue add @vue/plugin-name

# Serve built files locally
npm run serve

# Analyze bundle size
npm run analyze

# Check for Vue 3 compatibility
vue-compat-check
```

### 🐛 **Debugging Commands**
```bash
# Debug with Vue DevTools
npm run dev -- --debug

# Build with source maps
npm run build -- --sourcemap

# Check bundle analyzer
npm run build && npx webpack-bundle-analyzer dist/assets/*.js

# Performance profiling
npm run dev -- --profile
```


## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task, verify:
- [ ] ✅ I acknowledge all critical rules above
- [ ] Files go in proper module structure (not root)
- [ ] Use Task agents for >30 second operations
- [ ] TodoWrite for 3+ step tasks
- [ ] Commit after each completed task

## 🚨 TECHNICAL DEBT PREVENTION

### ❌ WRONG APPROACH (Creates Technical Debt):
```bash
# Creating new file without searching first
Write(file_path="new_component.vue", content="...")
```

### ✅ CORRECT APPROACH (Prevents Technical Debt):
```bash
# 1. SEARCH FIRST
Grep(pattern="component.*similar", glob="*.vue")
# 2. READ EXISTING FILES  
Read(file_path="src/main/vue/components/existing_component.vue")
# 3. EXTEND EXISTING FUNCTIONALITY
Edit(file_path="src/main/vue/components/existing_component.vue", old_string="...", new_string="...")
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:
1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

---

**⚠️ Prevention is better than consolidation - build clean from the start.**  
**🎯 Focus on single source of truth and extending existing functionality.**  
**📈 Each task should maintain clean architecture and prevent technical debt.**