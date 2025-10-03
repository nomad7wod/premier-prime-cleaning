# Contributing to Premier Prime Cleaning Service

Thank you for your interest in contributing to Premier Prime! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- Go 1.21+ (for backend development)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/premier-prime-cleaning.git
   cd premier-prime-cleaning
   ```

2. **Start Development Environment**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## 📋 Development Guidelines

### Code Style
- **Frontend**: Use Prettier and ESLint configurations
- **Backend**: Follow Go standard formatting (`go fmt`)
- **Database**: Use descriptive table and column names
- **Git**: Use conventional commit messages

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:
- `feat(booking): add status filtering functionality`
- `fix(calendar): resolve timezone conversion issues`
- `docs(readme): update installation instructions`

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && go test ./...

# Frontend tests
cd frontend && npm test
```

### Manual Testing
1. Test all user flows (booking, admin management)
2. Verify responsive design on different screen sizes
3. Check cross-browser compatibility
4. Test with different data scenarios

## 📝 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Test Your Changes**
   - Run automated tests
   - Test manually in browser
   - Check for regressions

4. **Submit Pull Request**
   - Use descriptive title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, browser, device type
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console errors**: Any error messages

## 💡 Feature Requests

For new feature requests:
- **Use case**: Why is this feature needed?
- **Description**: Detailed description of the feature
- **Mockups**: UI mockups if applicable
- **Priority**: How important is this feature?

## 🏗️ Architecture Guidelines

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── services/      # API communication
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
└── utils/         # Utility functions
```

### Backend Structure
```
internal/
├── handlers/      # HTTP request handlers
├── services/      # Business logic
├── repositories/  # Database operations
├── models/        # Data models
├── middleware/    # Custom middleware
└── utils/         # Utility functions
```

## 🔒 Security Guidelines

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Follow OWASP security guidelines

## 📚 Documentation

- Update README.md for significant changes
- Comment complex code logic
- Update API documentation for endpoint changes
- Include JSDoc for JavaScript functions
- Add Go doc comments for exported functions

## 🎯 Areas for Contribution

### High Priority
- [ ] Email notification system
- [ ] SMS notification system
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)

### Medium Priority
- [ ] Advanced reporting dashboard
- [ ] Multi-language support
- [ ] Customer portal
- [ ] Inventory management

### Documentation
- [ ] API documentation
- [ ] User guides
- [ ] Deployment guides
- [ ] Video tutorials

## 📞 Getting Help

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact maintainers at support@premierprime.com

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions
- Special thanks in documentation

Thank you for contributing to Premier Prime! 🚀