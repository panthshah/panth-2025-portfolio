# Portfolio Theme Selector

A beautiful, interactive theme selection interface built with React, Three.js, and Framer Motion. Features animated shader-based textures for each theme with smooth transitions and professional UI.

## ✨ Features

- **5 Beautiful Themes**: Sky, Peachy Orange, Lavender Dream, Blush Petal, and Pastel Red
- **Shader-Based Textures**: Custom GLSL shaders with noise functions and animations
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Responsive Design**: Works perfectly on all screen sizes
- **Performance Optimized**: Unified shader system with precompilation
- **Clean Architecture**: Modular, maintainable code structure

## 🚀 Technologies Used

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics and WebGL
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Vite** - Fast build tool and dev server
- **GLSL** - Custom shaders for visual effects

## 📁 Project Structure

```
src/
├── components/
│   ├── textures/
│   │   ├── UnifiedTexture.jsx    # Unified shader component
│   │   └── NoiseTexture.jsx      # Fallback noise texture
│   ├── SplashScreen.jsx          # Loading screen
│   └── ThemeSelection.jsx        # Main theme selector
├── styles/
│   └── ThemeSelection.css        # Clean CSS styles
├── utils/
│   └── shaderPreloader.js        # Shader precompilation
└── App.jsx                       # Main application
```

## 🎨 Theme System

The application uses a unified texture system where all themes share the same shader code but with different configurations:

```javascript
const TEXTURE_CONFIGS = {
  'Sky': {
    intensity: 0.410,
    colors: [/* sky blue colors */],
    speed: 0.200,
    scale: 0.334
  },
  // ... other themes
};
```

## 🛠️ Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🎯 Key Features

### Unified Shader System
- Single shader component handles all themes
- 80% reduction in code duplication
- Easy to add new themes
- Optimized performance

### Animation System
- Smooth theme transitions
- Hover and click animations
- Loading states with fallbacks
- Professional micro-interactions

### Performance Optimizations
- Shader precompilation
- Lazy loading
- Optimized WebGL settings
- Efficient memory management

## 🎨 Adding New Themes

To add a new theme, simply:

1. Add theme configuration to `TEXTURE_CONFIGS` in `UnifiedTexture.jsx`
2. Add theme object to the `themes` array in `ThemeSelection.jsx`
3. Done! The unified system handles everything else

## 📱 Responsive Design

The interface adapts beautifully to different screen sizes:
- Desktop: Full 5-theme layout
- Tablet: Optimized spacing
- Mobile: Touch-friendly interactions

## 🚀 Performance

- **Fast Loading**: Shader precompilation prevents runtime delays
- **Smooth Animations**: 60fps animations with optimized transitions
- **Memory Efficient**: Shared shader code and proper cleanup
- **Bundle Optimized**: Tree-shaking and code splitting

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using modern web technologies