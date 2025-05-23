# ByteVerse Proposal

![ByteVerse Banner](public/BG_SECOND.png)

## 🚀 Overview

ByteVerse is an immersive, interactive web experience designed for Sheryians Coding School to help recruit mentors and showcase the creative potential of coding education. The site features advanced animations, responsive design, and a visually engaging interface inspired by modern game aesthetics.

## ✨ Features

- **Interactive SVG Animation**: Opening lion animation with eye-focused zoom transition
- **Parallax Effects**: Multi-layered parallax backgrounds and text elements that respond to mouse movement
- **Scroll-Triggered Animations**: Dynamic content transitions between sections based on scroll position
- **3D Text Effects**: Rotating circular text with 3D perspective
- **Fully Responsive Design**: Optimized viewing experience across all device sizes
- **GTA-Style Typography**: Bold, impactful text styling reminiscent of popular game interfaces

## 🛠️ Technologies Used

- **React**: Frontend framework
- **GSAP (GreenSock Animation Platform)**: Advanced animations
  - DrawSVGPlugin
  - MotionPathPlugin
  - ScrollTrigger
- **TailwindCSS**: Styling and responsive design
- **Vite**: Build tool and development server

## 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ByteVerse_Proposal.git
   cd ByteVerse_Proposal
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Responsive Design

The site is fully responsive across various device sizes:
- **Desktop**: Full experience with all visual effects
- **Tablet**: Optimized layouts and scaled visuals
- **Mobile**: Streamlined experience with focused content and appropriately sized elements

## 📂 Project Structure

```
ByteVerse_Proposal/
├── public/
│   ├── BG_SECOND.png
│   └── ...other public assets
├── src/
│   ├── components/
│   │   ├── AnimationComponent.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── ...other source files
├── .gitignore
├── package.json
└── vite.config.js
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the creative potential of coding education
- Designed for Sheryians Coding School's mentor recruitment efforts