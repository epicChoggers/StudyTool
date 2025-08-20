# Study Tool

A modern, mobile-friendly quiz application built with React, TypeScript, and Vite. This study tool provides an interactive quiz experience similar to Canvas's quiz functionality.

## Features

- **Modern UI**: Clean, responsive design with smooth animations
- **Mobile Friendly**: Optimized for all device sizes
- **Interactive Quiz**: Multiple choice questions with immediate feedback
- **Progress Tracking**: Shows current question and score
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Quiz Selector**: Choose from individual quiz banks or comprehensive review
- **Comprehensive Review**: Randomized questions from all available quizzes

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (CSS Grid, Flexbox, CSS Variables)
- **State Management**: React Hooks (useState, useEffect)
- **Deployment**: GitHub Pages with GitHub Actions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StudyTool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
StudyTool/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── utils/
│       └── quizUtils.ts # Quiz data utilities
├── public/
│   └── quizzes/         # Quiz JSON files
├── .github/
│   └── workflows/       # GitHub Actions deployment
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Customization

### Adding Questions

To add new questions, modify the `sampleQuestions` array in `src/App.tsx`:

```typescript
const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2 // Index of correct answer (0-based)
  }
  // Add more questions...
];
```

### Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layout
- CSS Variables for consistent theming
- Smooth transitions and animations
- Mobile-first responsive design

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Enable GitHub Pages**: Go to repository Settings > Pages
3. **Set Source**: Select "GitHub Actions" as the source
4. **Automatic Deployment**: Every push to the `main` branch will trigger a deployment

The application will be available at: `https://<username>.github.io/StudyTool/`

### Manual Deployment

To deploy manually:

```bash
npm run build
# Upload the contents of the 'dist' folder to your web server
```

## Future Enhancements

- Question bank management
- User authentication
- Progress persistence
- Different question types
- Timer functionality
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
