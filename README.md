# 🕐 Corner Time - Modern Currency Timer

A cutting-edge timer application that combines location-based currency detection with focus productivity. Built for the 2025-2027 era with modern animations and user experience.

## ✨ Features

### 🌍 Location-Based Currency Detection

- **Automatic Location Detection**: Uses IP geolocation to detect user's country
- **Local Currency Display**: Shows currency symbols based on user's location
- **Global Currency Support**: Supports the 5 most globally used currencies (USD, EUR, CNY, JPY, GBP)
- **Fallback System**: Graceful fallback to USD if location detection fails

### 💰 Currency Animation System

- **Real-time Currency Symbols**: Shows `-{currencySymbol}` every second during countdown
- **Completion Rewards**: Displays `+{currencySymbol}` when timer completes
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Visual Feedback**: Glowing effects and scale animations

### 🎯 Focus Timer Features

- **Pomodoro Timer**: 25-minute default focus sessions
- **Custom Duration**: Set custom hours, minutes, and seconds
- **Preset Timers**: Quick access to 5min, 15min, 25min, 1hr
- **Stopwatch Mode**: Count up timer for tracking work sessions
- **Clock Mode**: Real-time current time display

### 🎨 Modern Visual Design

- **Technology Font**: Custom Technology-Italic font for futuristic display
- **Gradient Backgrounds**: Modern gradient color schemes
- **Glow Effects**: LED-style text shadows and button effects
- **Smooth Transitions**: Hover effects and micro-interactions
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🚀 Advanced UX Features

- **Fullscreen Mode**: Immersive focus experience
- **Loading States**: Smooth loading animations with location detection
- **Completion Celebrations**: Visual feedback when timer completes
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **IP Geolocation API** for location detection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd corner-time

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🎯 Use Cases

### For Productivity

- **Focus Sessions**: 25-minute Pomodoro technique
- **Deep Work**: Extended custom timers for complex tasks
- **Time Tracking**: Stopwatch for logging work hours

### For Motivation

- **Visual Feedback**: Currency symbols create urgency
- **Completion Rewards**: Positive reinforcement on timer completion
- **Location Awareness**: Personalized experience based on user's country

## 🌟 2025-2027 Design Vision

### Modern Aesthetics

- **Neon Glow Effects**: Futuristic LED-style displays
- **Gradient Backgrounds**: Depth and visual interest
- **Smooth Animations**: 60fps fluid transitions
- **Custom Typography**: Technology font for sci-fi feel

### User Experience

- **Intuitive Interface**: One-click timer controls
- **Visual Hierarchy**: Clear information architecture
- **Responsive Design**: Seamless across all devices
- **Accessibility**: Inclusive design principles

### Performance

- **Fast Loading**: Optimized bundle sizes
- **Smooth Animations**: Hardware-accelerated transitions
- **Offline Capable**: Works without internet connection
- **Progressive Enhancement**: Graceful degradation

## 🔧 Configuration

### Customizing Currencies

Edit `src/utils/currency.ts` to add more countries and currencies:

```typescript
const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  // Add your country codes here
  YOUR_COUNTRY: { code: "YOUR_CURRENCY", symbol: "¥", name: "Your Currency" },
};
```

### Styling Customization

Modify `src/index.css` for custom visual effects:

```css
.digital-display {
  /* Custom glow effects */
  text-shadow: 0 0 10px #YOUR_COLOR, 0 0 20px #YOUR_COLOR;
}
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for modern styling
- **Technology Font** for the futuristic display
- **IP Geolocation API** for location detection

---

**Built with ❤️ for the future of productivity**
