# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-11-26

### 🚀 Added

- **Merge Request Comments & Discussions**: Full support for MR review workflows
  - `list_mr_notes` - List all comments on a merge request
  - `list_mr_discussions` - List threaded discussions
  - `create_mr_note` - Add top-level comments
  - `create_mr_discussion` - Create new discussion threads with optional inline code positioning
  - `reply_to_mr_discussion` - Reply to existing discussion threads
  - `resolve_mr_discussion` - Mark discussions as resolved
  - `unresolve_mr_discussion` - Mark discussions as unresolved

- **Merge Request Draft Status Management**
  - `mark_mr_as_draft` - Mark MR as draft (adds "Draft:" prefix)
  - `mark_mr_as_ready` - Mark MR as ready for review (removes "Draft:" or "WIP:" prefix)

- **Merge Request Templates**
  - `list_mr_templates` - List available MR templates in a project
  - `get_mr_template` - Get template content for use in MR descriptions

- **Enhanced Merge Request Filtering**
  - Added `reviewer_id` filter to `list_merge_requests`
  - Added `reviewer_username` filter to `list_merge_requests`
  - Filter MRs where you're assigned as reviewer

### 🧪 Testing

- **Modular Test Structure**: Refactored MR tests into focused test files
  - `merge-requests.test.ts` - Core MR operations (list, get, create, update)
  - `merge-requests-notes.test.ts` - Notes and discussions functionality
  - `merge-requests-draft.test.ts` - Draft/ready status management
  - `merge-requests-templates.test.ts` - Template operations
- **104 tests** across 12 test files with comprehensive coverage

### 📚 Documentation

- Updated README with new MR review workflow features
- Updated tools.md with all 11 new tools and enhanced parameters
- Added usage examples for comment and review workflows

### 🔄 Backward Compatibility

- **No Breaking Changes**: All existing functionality preserved
- **11 New Tools**: Added without affecting existing tools
- **Enhanced Existing Tool**: `list_merge_requests` now supports reviewer filtering

---

## [1.3.1] - 2025-07-12

### 🔧 Bug Fixes
- **Package Distribution**: Fixed npm package to include all required files (86 files vs 10)
- **Binary Execution**: Made CLI executable with proper file permissions
- **Test Compatibility**: Updated test expectations for v1.3.x releases

### 📦 Package Improvements
- Complete modular file structure now included in npm distribution
- Binary `gitlab-mcp-server` command now works correctly via npx
- Increased package size to 141.9 kB to include all handlers and tools

---

## [1.3.0] - 2025-07-12

### 🚀 Added
- **Merge Request Updates**: New `update_merge_request` tool for comprehensive merge request management
  - Update title, description, assignees, reviewers, labels
  - Change state (close/reopen merge requests)
  - Modify target branch, milestone, and collaboration settings
  - Support for squash, remove source branch, and merge-when-pipeline-succeeds options
- **Token Usage Optimization**: `list_projects` now uses `simple=true` by default, reducing response size from 40k+ tokens to much smaller payloads
- **Modular Architecture**: Complete refactoring into clean, maintainable modules:
  - `src/client.ts` - GitLab API client wrapper
  - `src/server.ts` - Main MCP server implementation  
  - `src/handlers/` - Domain-specific handler modules (projects, issues, merge requests, etc.)
- **Comprehensive Test Suite**: 75+ tests with 35%+ code coverage
  - Unit tests for all handlers with mocked dependencies
  - Integration tests for server initialization
  - Configuration loading and validation tests
  - Error handling scenarios
- **Enhanced Documentation**: Modular documentation structure in `docs/` folder
  - Installation guide with multiple setup options
  - Complete tool reference with examples
  - TypeScript usage guide
  - Development guide for contributors
  - Real-world usage examples

### ⚡ Performance
- **90%+ Token Reduction**: Project listing now returns minimal essential data by default
- **Faster API Responses**: Reduced payload sizes improve response times
- **Smart Data Loading**: Use `simple=false` only when full project details are needed

### 🔧 Technical Improvements
- **Modular Codebase**: Broke down 705-line monolithic file into focused modules
- **Better Separation of Concerns**: Clear boundaries between API client, handlers, and server setup
- **Enhanced Type Safety**: Comprehensive TypeScript coverage with strict typing
- **Professional Code Structure**: Follows industry best practices for maintainability

### 📚 Documentation
- **Streamlined README**: Reduced from 503 to 84 lines, focused on quick start
- **Modular Docs**: Organized documentation by topic in dedicated `docs/` folder
- **Usage Examples**: Real-world scenarios and workflow examples
- **Configuration Guide**: Complete setup options and customization

### 🧪 Testing
- **Professional Test Suite**: From 0% to 35%+ code coverage
- **Handler Tests**: Individual testing of all domain handlers
- **Configuration Tests**: Comprehensive config loading and validation
- **Error Handling**: Tests for edge cases and failure scenarios

### 🔄 Backward Compatibility
- **No Breaking Changes**: All existing functionality preserved
- **New Features**: Added `update_merge_request` tool without affecting existing tools
- **Opt-in Optimizations**: Default behavior improved, but original behavior available via `simple=false`
- **Seamless Migration**: Existing users benefit from optimizations without code changes

### 📦 Development
- **Better Build Process**: Improved TypeScript compilation and module resolution
- **Enhanced Testing**: Comprehensive test coverage with vitest
- **Code Quality**: ESLint configuration and consistent code style

---

## [1.2.0] - Previous Release

### Added
- Enhanced job trace functionality with partial logs and pagination support
- Complete TypeScript support with comprehensive type definitions
- Development setup with Vitest, ESLint, and comprehensive testing

### Fixed
- Node modules and build artifacts properly excluded from git tracking

---

## [1.1.0] - Previous Release

### Added
- Basic GitLab MCP server functionality
- Project, issue, merge request, and pipeline management
- Initial TypeScript support

---

## How to Update

### For npm users:
```bash
npm update @alosies/gitlab-mcp-server
```

### For npx users (Claude Desktop):
No action needed - npx automatically uses the latest version.

### For global installations:
```bash
npm install -g @alosies/gitlab-mcp-server@latest
```

## Migration Notes

### v1.2.0 → v1.3.0
- **✅ No breaking changes** - all existing functionality works unchanged
- **🚀 Automatic optimization** - `list_projects` now returns minimal data by default for better performance
- **🔧 Enhanced features** - access to new modular architecture and comprehensive testing
- **📖 Better docs** - improved documentation structure for easier reference

If you need the old verbose project listing behavior, you can:
1. Ask Claude to "list projects with full details" 
2. The LLM will automatically use `simple=false` parameter

All other tools and functionality remain identical.