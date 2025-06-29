
# 🚀 DevProfile Viewer

A modern, responsive GitHub profile and repository viewer built with React, TypeScript, and the GitHub REST API. Discover GitHub profiles, explore repositories, and analyze developer statistics in a beautiful, user-friendly interface.

![DevProfile Viewer](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-3.0.4-purple?logo=vite)
![GitHub API](https://img.shields.io/badge/GitHub%20API-REST-green?logo=github)

## ✨ Features

### 🔍 **Profile Discovery**
- Search GitHub users by username
- View comprehensive profile information
- Display avatar, bio, location, company, and social links
- Show join date and contact information

### 📊 **Repository Analytics**
- Browse user's public repositories
- Sort by stars, forks, or last updated
- Filter repositories by programming language
- View repository statistics (stars, forks, language)
- Display repository topics and descriptions
- Quick access to repository links

### 📈 **Developer Statistics**
- Total commits across repositories
- Pull request statistics (total and open)
- Programming language breakdown
- Repository count and follower metrics
- Language usage visualization with color coding

### 🎨 **Modern UI/UX**
- **Dark/Light Theme Toggle** - Seamless theme switching with persistence
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Skeleton Loading** - Beautiful loading states instead of spinners
- **Search History** - Quick access to previously searched profiles
- **Shareable URLs** - Direct links to user profiles
- **Hover Effects** - Interactive animations and transitions

### 🛠️ **Advanced Features**
- **Repository Filtering** - Filter by programming language
- **Smart Sorting** - Sort repos by stars, forks, or update time
- **Error Handling** - Graceful 404 and API error management
- **Rate Limiting** - Intelligent API usage to prevent limits
- **Local Storage** - Persistent search history and theme preferences
- **URL Parameters** - Shareable profile links (e.g., `?user=username`)

## 🚀 Live Demo

Visit the live application: [DevProfile Viewer on Replit](https://devprofile-viewer.replit.dev)

## 🏗️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 4.7.4
- **Build Tool**: Vite 3.0.4
- **Styling**: CSS3 with CSS Variables
- **API**: GitHub REST API v3
- **Hosting**: Replit
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Theme System**: Context API with localStorage persistence

## 🎯 Project Structure

```
src/
├── components/
│   ├── UserProfile.tsx      # User profile display component
│   ├── RepoList.tsx         # Repository list container
│   ├── RepoCard.tsx         # Individual repository card
│   ├── RepoFilters.tsx      # Repository filtering controls
│   ├── ThemeToggle.tsx      # Dark/light theme switcher
│   ├── SkeletonLoader.tsx   # Loading state components
│   └── Loader.tsx           # Spinner component
├── contexts/
│   └── ThemeContext.tsx     # Theme management context
├── App.tsx                  # Main application component
├── App.css                  # Global styles and theme variables
├── types.ts                 # TypeScript type definitions
└── index.tsx                # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devprofile-viewer.git
   cd devprofile-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage

1. **Search for a GitHub user** by entering their username in the search box
2. **View their profile** including bio, stats, and top programming languages
3. **Explore repositories** with filtering and sorting options
4. **Toggle between themes** using the theme switcher
5. **Use search history** to quickly revisit previous searches
6. **Share profiles** using the generated URL parameters

### Example Searches
Try searching for popular GitHub users:
- `torvalds` - Linus Torvalds (Linux creator)
- `gaearon` - Dan Abramov (React core team)
- `tj` - TJ Holowaychuk (Express.js creator)
- `sindresorhus` - Sindre Sorhus (Popular open source maintainer)

## 🔧 Configuration

### Environment Variables
No environment variables required! The app uses the public GitHub API.

### Theme Customization
Themes are controlled via CSS variables in `App.css`. You can customize:
- Primary and secondary colors
- Background colors
- Border colors
- Font families and sizes

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+): Full sidebar layout with grid
- **Tablet** (768px-1199px): Stacked layout with responsive grid
- **Mobile** (320px-767px): Single column layout with touch-friendly controls

## 🔍 API Integration

### GitHub REST API Endpoints Used:
- `GET /users/{username}` - User profile information
- `GET /users/{username}/repos` - User repositories
- `GET /repos/{owner}/{repo}/commits` - Repository commits (limited)
- `GET /repos/{owner}/{repo}/pulls` - Pull requests (limited)

### Rate Limiting
- **Unauthenticated**: 60 requests per hour per IP
- **Authenticated**: 5,000 requests per hour (not implemented)

## 🚀 Deployment on Replit

This project is optimized for Replit deployment:

1. **Fork this Repl** or import from GitHub
2. **Hit the Run button** - Vite will start automatically
3. **Access via the webview** or get the public URL
4. **Deploy to production** using Replit's deployment feature

### Replit Configuration
```toml
# .replit
run = "npm run dev"
modules = ["nodejs-20"]
deploymentTarget = "static"
build = ["npm", "run", "build"]
publicDir = "dist"
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Search functionality works with valid usernames
- [ ] Error handling for invalid usernames (404)
- [ ] Repository filtering by language
- [ ] Repository sorting by stars/forks/updated
- [ ] Theme toggle persistence
- [ ] Search history functionality
- [ ] Responsive design on different screen sizes
- [ ] URL sharing with user parameters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features

## 🐛 Known Issues & Limitations

- **Rate Limiting**: Public GitHub API has 60 requests/hour limit
- **Commit/PR Data**: Limited to first 10 repositories to prevent rate limiting
- **Private Repositories**: Only public repositories are accessible
- **Real-time Data**: Data is fetched on demand, not real-time

## 🔮 Future Enhancements

- [ ] GitHub OAuth integration for higher rate limits
- [ ] Repository contribution graphs
- [ ] Advanced analytics and charts
- [ ] Export profile data to PDF
- [ ] Comparison between multiple users
- [ ] GitHub organization support
- [ ] Real-time GitHub activity feed
- [ ] Repository language pie charts
- [ ] GitHub stars timeline

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- **GitHub** for providing the comprehensive REST API
- **React Team** for the amazing framework
- **Vite** for the blazing fast build tool
- **Replit** for the seamless hosting platform
- **Open Source Community** for inspiration and best practices

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ using React, TypeScript, and the GitHub API
