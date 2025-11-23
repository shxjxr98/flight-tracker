# ✈️ FlightTracker

A modern, real-time flight tracking web application built with Next.js and the AviationStack API. Now featuring a robust mock data fallback system for reliable testing.

![FlightTracker Screenshot](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

## 🌟 Features

### Core Functionality
- **Real-time Flight Data**: Search for any flight by flight number (e.g., BA11, AA100)
- **Smart Mock Data Fallback**: Automatically switches to mock data if API rate limits are reached
- **Live Status Updates**: Visual indicators for On Time, Delayed, Boarding, and Landed states
- **Auto-Refresh**: Polls for updates every 30 seconds to keep data fresh

### User Experience
- **Modern Flight Card**: Clean, minimal card design with status bar, large time displays, and bottom info icons
- **Skeleton Shimmer**: Smooth loading states for better perceived performance
- **Haptic Feedback**: Tactile vibration on mobile interactions (buttons, toggles, success/error states)
- **Dark Mode**: Persisted theme preference with smooth transitions
- **Responsive Design**: Optimized for all device sizes with mobile-first approach

### Interactive Tools
- **Flight Map**: Visual route visualization
- **Analog & Digital Clocks**: Dual time zone displays for departure and arrival
- **Action Buttons**:
  - 🔔 **Get Alerts**: Subscribe to flight updates
  - 📤 **Share Flight**: Native share sheet integration with clipboard fallback
  - 📅 **Add to Calendar**: Download .ics file for your schedule
  - 🗺️ **Terminal Map**: Direct link to Google Maps for terminal/gate navigation

## 🚀 Live Demo

> **Note**: This is currently a prototype for testing. Full deployment to Vercel coming soon!

For now, you can run the project locally:
```bash
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom design system (Variables, Glass-morphism)
- **API**: [AviationStack](https://aviationstack.com/) + Custom Mock Data Layer
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/shxjxr98/flight-tracker.git
cd flight-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your AviationStack API key:
```env
AVIATIONSTACK_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Mock Data Mode

The app includes a built-in mock data system for development when API limits are reached.

**Available Test Flights:**
- `AA100`: On Time (JFK → LAX)
- `BA11`: Boarding (LHR → SIN)
- `DL123`: Delayed (ATL → MIA)
- `UA456`: Landed (SFO → NRT)
- `EK202`: On Time (DXB → JFK)

## 🏗️ Project Structure

```
flight-tracker/
├── app/
│   ├── actions.ts          # Server actions with API/Mock logic
│   ├── globals.css         # Global styles, themes, and animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application logic
├── components/
│   ├── AnalogClock.tsx     # Real-time analog clock
│   ├── BoardingPass.tsx    # Modern flight card component
│   ├── DarkModeToggle.tsx  # Theme switcher
│   ├── FlightMap.tsx       # Route visualization
│   ├── ProgressBar.tsx     # Flight progress indicator
│   └── SkeletonLoader.tsx  # Loading state component
├── utils/
│   └── haptic.ts           # Haptic feedback utility
└── public/                 # Static assets
```

## 🚢 Deployment

This app is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `AVIATIONSTACK_API_KEY` environment variable
4. Deploy!

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and AviationStack API
