# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-06-12

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