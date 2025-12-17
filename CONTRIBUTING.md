# Contributing to Linkly AI CRM

Thank you for your interest in contributing to Linkly AI CRM! This guide will help you get started with collaboration.

## Table of Contents
- [Adding Collaborators](#adding-collaborators)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)

## Adding Collaborators

### For Repository Owners

If you own this repository and want to add team members or collaborators, you have several options depending on your GitHub account type:

#### GitHub Free Account
With a free account, you can:
- Add unlimited collaborators to public repositories
- Add collaborators to private repositories (with limitations on the number of collaborators)

#### GitHub Pro Account
With GitHub Pro, you get additional benefits:
- **Advanced tools and insights** for individual developers
- **Protected branches** for code review requirements
- **GitHub Pages** with custom domains
- **Multiple reviewers** for pull requests

**Note:** GitHub Pro is designed for individual developers. To add multiple team members with more sophisticated permissions and team management, consider upgrading to **GitHub Team** or **GitHub Enterprise**.

### How to Add Someone to Your Repository

#### Step 1: Navigate to Repository Settings
1. Go to your repository on GitHub: `https://github.com/ioproxxy/linkly-ai-crm`
2. Click on **Settings** (top menu bar)
3. In the left sidebar, click **Collaborators and teams**

#### Step 2: Add a Collaborator
1. Click the **Add people** button
2. Enter the GitHub username or email of the person you want to add
3. Select the appropriate permission level:
   - **Read**: Can view and clone the repository
   - **Triage**: Can manage issues and pull requests without write access
   - **Write**: Can push to the repository
   - **Maintain**: Can manage the repository without access to sensitive actions
   - **Admin**: Full access including settings and deletion

4. Click **Add [username] to this repository**

#### Step 3: Collaborator Accepts Invitation
The invited user will receive an email invitation and must:
1. Click the invitation link
2. Accept the invitation on GitHub
3. They will then have access based on the permissions you granted

### GitHub Organizations and Teams

For better team management, consider creating a **GitHub Organization**:

1. **Create an Organization** (Free or paid plans available)
   - Go to https://github.com/organizations/new
   - Choose a plan (Free, Team, or Enterprise)
   
2. **Benefits of GitHub Team or Enterprise:**
   - **Team access controls**: Organize members into teams with different permissions
   - **Code review assignments**: Automatically assign reviewers
   - **Draft pull requests**: Share work in progress
   - **Team discussions**: Built-in communication
   - **SAML single sign-on** (Enterprise)
   - **Advanced security features**

### Upgrading from Pro to Team

If you currently have GitHub Pro and want better team collaboration:

1. Go to your GitHub settings: https://github.com/settings/billing
2. Under "Plans and usage", click **Change plan**
3. Select **GitHub Team** for organization-level collaboration
4. Team plans start at $4 per user/month (when billed annually)

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Gemini API key (for AI features)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ioproxxy/linkly-ai-crm.git
   cd linkly-ai-crm
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, etc.
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Run the application:**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   cd backend
   npm run start:dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Contribution Guidelines

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow existing code style and conventions
   - Write meaningful commit messages
   - Test your changes locally

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Go to the repository on GitHub
   - Click "Pull requests" → "New pull request"
   - Select your branch
   - Fill in the PR description with:
     - What changes you made
     - Why you made them
     - Any relevant issue numbers
   - Submit the PR for review

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Commit Message Format

We follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be part of the next release!

## Getting Help

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/ioproxxy/linkly-ai-crm/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/ioproxxy/linkly-ai-crm/discussions)
- **Documentation**: Check the README files in the main and backend directories

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

Thank you for contributing to Linkly AI CRM! 🚀
