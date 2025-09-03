# Contributing to StageLog

Thank you for your interest in contributing to StageLog! 🎭

## How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue already exists
2. Use the appropriate issue template
3. Provide as much detail as possible
4. Include steps to reproduce the problem

### Suggesting Features

We welcome feature suggestions! Please:
1. Check if the feature has been requested before
2. Describe the feature clearly
3. Explain why it would be useful
4. Consider the impact on accessibility and privacy

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/spike1478/stagelog.git
   cd stagelog
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** following our coding standards

5. **Test your changes** thoroughly

6. **Commit your changes**:
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**

#### Coding Standards

##### JavaScript
- Use meaningful variable and function names
- Add JSDoc comments for functions and classes
- Follow the existing code style and patterns
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Handle errors gracefully with try-catch blocks

##### CSS
- Use CSS custom properties (variables) for theming
- Follow BEM methodology for class naming
- Ensure responsive design principles
- Maintain accessibility standards (WCAG 2.2 AA)
- Use semantic color names in comments

##### HTML
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure proper heading hierarchy
- Add alt text for images
- Use proper form labels

#### Testing

Before submitting a pull request:
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify accessibility with screen readers
- [ ] Test keyboard navigation
- [ ] Check dark/light mode compatibility
- [ ] Verify data persistence works correctly
- [ ] Test export/import functionality

#### Commit Message Format

Use clear, descriptive commit messages:
- `Add: new feature description`
- `Fix: bug description`
- `Update: change description`
- `Remove: removal description`
- `Docs: documentation update`
- `Style: formatting changes`
- `Refactor: code restructuring`

## Development Guidelines

### Architecture Principles

1. **No Frameworks**: Keep it vanilla HTML, CSS, and JavaScript
2. **Accessibility First**: All features must be accessible
3. **Privacy Focused**: No external tracking or data collection
4. **Progressive Enhancement**: Core functionality works without JavaScript
5. **Mobile First**: Responsive design from the start

### File Organization

- `index.html` - Main application file
- `styles.css` - All styling and theming
- `app-fixed.js` - Core application logic
- `stats-system.js` - Analytics and statistics
- `analytics-functions.js` - Analytics page functions
- `debug-system.js` - Debugging tools
- `init-code.js` - Initialization code

### Data Handling

- All data stored in localStorage
- No server-side dependencies
- Export/import functionality for data portability
- Graceful handling of missing or corrupted data

### Accessibility Requirements

All contributions must maintain WCAG 2.2 AA compliance:
- Color contrast ratios of at least 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure
- Proper ARIA labels and roles

## Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Add Tests**: Include any necessary testing instructions
3. **Update Version**: Bump version number if appropriate
4. **Check Checklist**: Ensure all items are completed
5. **Request Review**: Assign appropriate reviewers

### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review of the code has been performed
- [ ] Code has been tested in multiple browsers
- [ ] Accessibility has been verified
- [ ] Documentation has been updated
- [ ] No sensitive data is included
- [ ] Commit messages are clear and descriptive

## Community Guidelines

### Be Respectful
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Be Collaborative
- Help others learn and grow
- Share knowledge and resources
- Work together to solve problems
- Celebrate others' contributions

### Be Professional
- Keep discussions focused on the project
- Avoid off-topic conversations
- Use appropriate language and tone
- Respect others' time and effort

## 🤖 AI-Assisted Development

**AI assistance is not only allowed but encouraged!** We believe AI tools can help create better, more accessible software when used responsibly.

### AI Development Guidelines

#### ✅ **What's Encouraged**
- **Code Generation**: Use AI to help write functions, components, and features
- **Bug Fixing**: Leverage AI to identify and resolve issues
- **Documentation**: Use AI to improve code comments and documentation
- **Testing**: Generate test cases and validation logic
- **Accessibility**: Use AI to ensure WCAG compliance and inclusive design
- **Code Review**: Use AI to review code for best practices and potential issues

#### 🔍 **Required Testing Before Merge**
**All AI-generated code MUST be thoroughly tested before submission:**

- [ ] **Manual Testing**: Test all functionality in multiple browsers
- [ ] **Accessibility Testing**: Verify screen reader compatibility and keyboard navigation
- [ ] **Data Integrity**: Ensure localStorage operations work correctly
- [ ] **Error Handling**: Test edge cases and error scenarios
- [ ] **Performance**: Verify no performance regressions
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari, and Edge
- [ ] **Mobile Testing**: Verify responsive design works on mobile devices

#### 📝 **AI Transparency Requirements**
When submitting AI-assisted code:

1. **Mention AI Usage**: Include a note in your PR description about AI assistance
2. **Explain the Approach**: Describe how AI was used (code generation, debugging, etc.)
3. **Document Changes**: Ensure all AI-generated code is properly documented
4. **Verify Logic**: Double-check that AI-generated logic is correct and efficient

#### 🚫 **What to Avoid**
- **Blind Copy-Paste**: Never submit AI code without understanding and testing it
- **Sensitive Data**: Don't share private data with AI tools
- **Untested Code**: Never submit code that hasn't been thoroughly tested
- **Over-reliance**: Use AI as a tool, not a replacement for critical thinking

#### 💡 **Best Practices**
- **Iterative Development**: Use AI to generate initial code, then refine and improve
- **Code Review**: Always review AI-generated code for logic and efficiency
- **Documentation**: Add clear comments explaining complex AI-generated logic
- **Testing First**: Write tests before or alongside AI-generated code
- **Learning**: Use AI as a learning tool to understand new concepts and patterns

### Example PR Description
```markdown
## AI-Assisted Feature: [Feature Name]

**AI Usage**: Used [AI Tool] to help generate the initial [component/function] and then manually refined and tested the implementation.

**Testing Completed**:
- [x] Manual testing in Chrome, Firefox, Safari, Edge
- [x] Accessibility testing with screen reader
- [x] Mobile responsiveness verified
- [x] Data persistence tested
- [x] Error handling verified

**Changes**:
- Added [specific functionality]
- Improved [specific area]
- Fixed [specific issue]
```

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the docs/ folder for detailed guides
- **AI Development**: Feel free to discuss AI-assisted development approaches in discussions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for helping make StageLog better for theatre lovers everywhere! 🎭✨
