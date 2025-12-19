# 🤝 Contributing to Back2U Lost & Found System

Thank you for your interest in contributing to Back2U! This document provides guidelines and information for contributors.

## 🎯 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL with pgvector extension
- Git

### Development Setup
1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/back2u-lost-found.git
   cd back2u-lost-found
   ```

2. **Set up backend**
   ```bash
   cd backend
   python setup.py
   cp .env.example .env
   # Edit .env with your configuration
   python app.py
   ```

3. **Set up frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include detailed steps to reproduce
4. Add screenshots if applicable
5. Specify your environment details

### ✨ Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Explain the problem you're solving
4. Provide detailed acceptance criteria
5. Consider technical implications

### 💻 Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(search): resolve search dropdown positioning issue
docs(readme): update installation instructions
```

#### Pull Request Process
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   python -m pytest tests/

   # Frontend tests
   cd frontend
   npm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

## 🎨 Code Style Guidelines

### Frontend (React)
- Use functional components with hooks
- Follow existing component structure
- Use meaningful variable names
- Add PropTypes for components
- Maintain responsive design principles

```javascript
// Good
const Dashboard = ({ user, onItemSelect }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="dashboard">
      {/* Component content */}
    </div>
  );
};
```

### Backend (Flask)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions
- Handle errors gracefully
- Use meaningful variable names

```python
# Good
def create_match(lost_item_id: int, found_item_id: int) -> dict:
    """Create a new match between lost and found items.
    
    Args:
        lost_item_id: ID of the lost item
        found_item_id: ID of the found item
        
    Returns:
        dict: Match details with similarity score
    """
    try:
        # Implementation
        return {"match_id": match.id, "similarity": 0.85}
    except Exception as e:
        logger.error(f"Failed to create match: {e}")
        raise
```

### CSS/Styling
- Use consistent naming conventions
- Maintain responsive design
- Follow existing color scheme
- Use Roboto font family hierarchy

```css
/* Good */
.dashboard-container {
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
}

.dashboard-header {
  font-family: 'Roboto Slab', serif;
  font-weight: 700;
  color: #1a1a1a;
}
```

## 🧪 Testing Guidelines

### Frontend Testing
- Write unit tests for components
- Test user interactions
- Verify responsive behavior
- Test API integration

```javascript
// Example test
describe('Dashboard Component', () => {
  test('renders user welcome message', () => {
    render(<Dashboard user={{ name: 'John' }} />);
    expect(screen.getByText(/Welcome back John/)).toBeInTheDocument();
  });
});
```

### Backend Testing
- Write unit tests for functions
- Test API endpoints
- Mock external services
- Test error scenarios

```python
# Example test
def test_create_match():
    """Test match creation functionality."""
    result = create_match(lost_item_id=1, found_item_id=2)
    assert result['similarity'] > 0.8
    assert 'match_id' in result
```

## 📚 Documentation

### Code Documentation
- Add comments for complex logic
- Document API endpoints
- Update README for new features
- Include examples in docstrings

### User Documentation
- Update user guides for new features
- Add screenshots for UI changes
- Maintain API documentation
- Update deployment guides

## 🔍 Review Process

### What We Look For
- **Functionality**: Does it work as expected?
- **Code Quality**: Is it readable and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it properly documented?
- **Performance**: Does it impact system performance?
- **Security**: Are there any security implications?

### Review Timeline
- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Merge: After approval from 2+ maintainers

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issue
- `priority: low` - Low priority issue
- `frontend` - Frontend related
- `backend` - Backend related
- `ai/ml` - AI/ML related

## 🎉 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Special mentions in project updates

## 📞 Getting Help

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: contribute@back2u.com

## 📋 Checklist for Contributors

Before submitting a PR, ensure:
- [ ] Code follows style guidelines
- [ ] Tests are added and passing
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] PR template is filled out
- [ ] Related issues are linked
- [ ] Screenshots added for UI changes

Thank you for contributing to Back2U! 🎓✨