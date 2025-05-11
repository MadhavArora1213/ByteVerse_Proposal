import React, { useState, useEffect, useRef } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger" // Add ScrollTrigger import
import "remixicon/fonts/remixicon.css"
import './App.css'

// Register GSAP plugins
gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, ScrollTrigger) // Add ScrollTrigger here

// Color constants from logo
const COLORS = {
  orange: "#D26E1C",
  yellow: "#F7CD21",
  offwhite: "#FCFAF3",
  blue: "#024FA9",
  darkBg: "#0F172A"
}

// Replace the ClipPathImage component with a simpler FullImage component
function FullImage({ imageUrl }) {
  return (
    <div className="full-character-image">
      <img
        src={imageUrl}
        alt="Character"
        className="w-auto h-full object-contain transition-transform duration-300"
      />
    </div>
  );
}

function App() {
  const [showContent, setShowContent] = useState(false)
  const [svgContent, setSvgContent] = useState(null)
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const flashRef = useRef(null)
  const centerHeroRef = useRef(null)
  const clipImageRef = useRef(null)
  const secondSectionRef = useRef(null)
  const sloganSectionRef = useRef(null) // Add ref for third section
  const finalImageRef = useRef(null) // Add ref for the final centered image
  
  // Load the SVG content from the file
  useEffect(() => {
    fetch('/image.svg')
      .then(response => response.text())
      .then(svgText => {
        // Extract just the SVG content
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const svg = svgDoc.querySelector('svg')
        
        if (svg) {
          // Store the content for use in rendering
          setSvgContent(svg.innerHTML)
        }
      })
      .catch(error => console.error('Error loading SVG:', error))
  }, [])
  
  // Enhanced drawing animation with eye zoom
  useGSAP(() => {
    if (!svgContent || !svgRef.current) return
    
    const paths = svgRef.current.querySelectorAll('path')
    if (paths.length === 0) return
    
    const tl = gsap.timeline()
    
    // First hide all paths - set their drawSVG to 0%
    gsap.set(paths, { 
      drawSVG: "0%",
      stroke: COLORS.blue,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "transparent"
    })

    // Draw the outlines first
    tl.to(paths, { 
      drawSVG: "100%",
      duration: 3,
      stagger: 0.05,
      ease: "power2.inOut",
    })
    
    // Fill all paths with color simultaneously
    .to(paths, {
      fill: function(i, target) {
        // Get the original fill color from the data attribute
        return target.getAttribute('data-fill') || target.getAttribute('fill') || "transparent"
      },
      stroke: "none",
      duration: 1.2, // Longer duration for more dramatic effect
      ease: "power1.inOut",
      stagger: 0, // No stagger - all fill at once
    })
    
    // Pause to appreciate the full drawing
    .to({}, { duration: 1 })
    
    // Zoom in effect from the eye
    .to(containerRef.current, {
      scale: 15,
      opacity: 0,
      duration: 2.5,
      ease: "power2.in",
      transformOrigin: "50% 45%", // Focus on eye area
      onStart: () => {
        // Flash effect as zoom intensifies
        gsap.to(flashRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 1.5
        })
      },
      onComplete: () => {
        setShowContent(true)
        document.querySelector(".svg-container").style.display = "none"
        
        // Fade out the flash
        gsap.to(flashRef.current, {
          opacity: 0,
          duration: 0.8,
        })
      }
    })
    
  }, [svgContent])

  // Hero section animation after lion reveal
  useGSAP(() => {
    if (!showContent) return

    // Initial state of hero elements
    gsap.set(".hero-element", {
      opacity: 0,
      y: 50
    })
    
    gsap.set(".main", {
      opacity: 0,
      scale: 1.2
    })
    
    gsap.set(".gta-style-title span", {
      opacity: 0,
      y: -50,
      filter: "blur(10px)"
    })
    
    gsap.set(".person-image", {
      opacity: 0,
      y: 100,
      scale: 0.8
    })

    const tl = gsap.timeline()

    // Add a quick radial wipe effect to simulate coming out of the eye
    const radialReveal = document.createElement('div')
    radialReveal.className = 'radial-reveal'
    radialReveal.style.position = 'fixed'
    radialReveal.style.top = '0'
    radialReveal.style.left = '0'
    radialReveal.style.width = '100%'
    radialReveal.style.height = '100%'
    radialReveal.style.background = `radial-gradient(circle at 42% 45%, transparent 0%, ${COLORS.darkBg} 100%)`
    radialReveal.style.zIndex = '90'
    radialReveal.style.pointerEvents = 'none'
    document.body.appendChild(radialReveal)

    // Fade in the main container with radial reveal
    tl.to(radialReveal, {
      background: `radial-gradient(circle at 50% 50%, transparent 100%, ${COLORS.darkBg} 100%)`,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        radialReveal.remove()
      }
    })
    
    .to(".main", {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.4")
    
    // Animate the title in GTA style
    .to(".gta-style-title span", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      stagger: 0.3,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.7")
    
    // Reveal three people with stagger
    .to(".person-image", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.5")
    
    // Fade in the remaining elements
    .to(".hero-element:not(.gta-style-title):not(.person-image)", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.7")
    
    // Remove hover animations for stability
    .add(() => {
      // Enhanced mouse parallax effect with multiple layers
      const imagesdiv = document.querySelector(".imagesdiv")
      imagesdiv?.addEventListener("mousemove", function (e) {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 60
        const yMove = (e.clientY / window.innerHeight - 0.5) * 30
        
        // Background parallax (slower movement)
        gsap.to(".parallax-bg", {
          x: xMove * 0.4,
          y: yMove * 0.2,
          duration: 1.2,
          ease: "power2.out"
        })
        
        // Text parallax (opposite direction for dramatic effect)
        gsap.to(".parallax-text", {
          x: -xMove * 0.2,
          y: -yMove * 0.1,
          duration: 1,
          ease: "power2.out"
        })
        
        // Remove character movement - characters stay stable
        
        // Apply general parallax to other elements with data-parallax-speed
        document.querySelectorAll('[data-parallax-speed]').forEach(element => {
          if (element.classList.contains('parallax-bg') || 
              element.classList.contains('parallax-text') ||
              element.classList.contains('character-container')) {
            return // Skip elements we've already animated above or want to keep stable
          }
          
          const speed = parseFloat(element.getAttribute('data-parallax-speed'))
          const direction = element.getAttribute('data-parallax-direction') || 1
          
          gsap.to(element, {
            x: xMove * speed * direction,
            y: yMove * speed * direction,
            duration: 1,
            ease: "power2.out"
          })
        })
      })
      
      // Advanced parallax for 3D section
      const interactiveSection = document.getElementById("interactive-3d-section")
      interactiveSection?.addEventListener("mousemove", function(e) {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 100
        const yMove = (e.clientY / window.innerHeight - 0.5) * 100
        
        // Apply parallax to elements with data-parallax-depth
        document.querySelectorAll('[data-parallax-depth]').forEach(element => {
          const depth = parseFloat(element.getAttribute('data-parallax-depth'))
          
          gsap.to(element, {
            x: xMove * depth,
            y: yMove * depth,
            rotateX: yMove * depth * 0.05,
            rotateY: -xMove * depth * 0.05,
            duration: 1,
            ease: "power2.out"
          })
        })
        
        // Special effect for light rays
        gsap.to(".light-rays", {
          backgroundPosition: `${xMove * 0.1}px ${yMove * 0.1}px`,
          duration: 1
        })
      })
    })
  }, [showContent])

  // Process SVG content to replace fill colors with data-fill attributes
  const processedSvgContent = svgContent ? 
    svgContent.replace(/fill="([^"]+)"/g, (match, fillColor) => {
      return `fill="transparent" data-fill="${fillColor}"`
    }) : null

  // Update the scroll animation to maintain larger image size
  useGSAP(() => {
    if (!showContent) return
    
    const centerHero = centerHeroRef.current
    const targetImage = clipImageRef.current
    const secondSection = secondSectionRef.current
    
    if (!centerHero || !targetImage || !secondSection) return
    
    // Hide the target image initially
    gsap.set(targetImage, { opacity: 0 })
    
    // Create a direct animation of the center character
    const movingHero = document.createElement('div')
    movingHero.className = 'moving-hero'
    movingHero.innerHTML = `<img src="/Harsh.png" alt="Moving Character" />`
    movingHero.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      opacity: 0;
      pointer-events: none;
    `
    document.body.appendChild(movingHero)
    
    // Make sure the image is styled correctly
    const heroImg = movingHero.querySelector('img')
    heroImg.style.cssText = `
      height: 100vh;
      max-height: calc(100vh - 100px);
      width: auto;
      object-fit: contain;
      object-position: bottom center;
      filter: drop-shadow(0px 0px 40px rgba(0,0,0,0.6));
    `
    
    // Create scroll trigger that pins the hero and moves it to the left
    ScrollTrigger.create({
      trigger: secondSection,
      start: "top bottom",
      end: "top 20%",
      scrub: 0.4,
      onUpdate: (self) => {
        // Only show our moving hero during the animation
        if (self.progress > 0) {
          gsap.set(movingHero, { opacity: 1 })
          gsap.set(centerHero, { opacity: 0 })
          
          // Target image position - move further left (25% from left edge)
          const targetX = window.innerWidth * 0.25
          
          // Starting position (center of screen)
          const startX = window.innerWidth / 2
          
          // Current position based on scroll progress
          const progress = self.progress
          const currentX = gsap.utils.interpolate(startX, targetX, progress)
          
          // Keep the scale much larger - minimum of 0.85 (85% of original size)
          const minScale = 0.85
          const currentScale = gsap.utils.interpolate(1, minScale, Math.min(progress, 1))
          
          // Update position and scale - keep image large
          gsap.set(movingHero, {
            x: currentX - window.innerWidth/2,
            scale: currentScale,
            transformOrigin: 'bottom center'
          })
          
          // When reaching final position, show the target image
          if (progress > 0.95) {
            const fadeProgress = (progress - 0.95) / 0.05
            gsap.set(targetImage, { opacity: fadeProgress })
            gsap.set(movingHero, { opacity: 1 - fadeProgress })
          } else {
            gsap.set(targetImage, { opacity: 0 })
          }
        } else {
          // Reset when at the top
          gsap.set(movingHero, { opacity: 0 })
          gsap.set(centerHero, { opacity: 1 })
          gsap.set(targetImage, { opacity: 0 })
        }
      },
      onLeave: () => {
        // Ensure target image is visible when section is fully entered
        gsap.to(targetImage, { opacity: 1, duration: 0.3 })
        gsap.to(movingHero, { opacity: 0, duration: 0.3 })
      },
      onEnterBack: () => {
        // Coming back to the animation zone
        gsap.to(targetImage, { opacity: 0, duration: 0.3 })
        gsap.to(movingHero, { opacity: 1, duration: 0.3 })
      },
      onLeaveBack: () => {
        // Leaving back to the top
        gsap.to(targetImage, { opacity: 0, duration: 0.2 })
        gsap.to(movingHero, { opacity: 0, duration: 0.2 })
        gsap.to(centerHero, { opacity: 1, duration: 0.3 })
      }
    })
    
    return () => {
      // Clean up
      if (movingHero && movingHero.parentNode) {
        movingHero.parentNode.removeChild(movingHero)
      }
    }
  }, [showContent])

  // Replace the third section animation with a completely new standalone circular text animation
  useGSAP(() => {
    if (!showContent) return
    
    const finalImage = finalImageRef.current
    const sloganSection = sloganSectionRef.current
    
    if (!finalImage || !sloganSection) return
    
    // Create the 3D circular text element - Styled to match reference image
    const circleTextContainer = document.createElement('div')
    circleTextContainer.className = 'circular-text-container'
    circleTextContainer.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 800px; /* Larger size to match reference */
      height: 800px; /* Larger size to match reference */
      z-index: 45;
      opacity: 0;
      pointer-events: none;
      transform-style: preserve-3d;
    `
    document.body.appendChild(circleTextContainer)
    
    // Create animation for section three - ADJUSTED to start later
    ScrollTrigger.create({
      trigger: sloganSection,
      start: "top 70%", // Start later - when section is 30% in view
      end: "center center",
      scrub: 1,
      onEnter: () => {
        // Setup the circular text with reference-matching style
        createReferenceMatchingText(circleTextContainer, " WHERE INNOVATION MEETS CREATIVITY ")
        
        // Make Harsh.png visible from the start
        gsap.set(finalImage, { opacity: 1, scale: 1 })
        gsap.set(circleTextContainer, { opacity: 0 })
      },
      onUpdate: (self) => {
        if (self.progress > 0) {
          const progress = self.progress
          
          // Fade in and animate the text container
          const textOpacity = gsap.utils.clamp(0, 1, progress * 2)
          
          gsap.set(circleTextContainer, {
            opacity: textOpacity,
            scale: gsap.utils.interpolate(0.95, 1.05, Math.min(1, progress * 1.5))
          })
        }
      },
      onLeave: () => {
        // Keep everything visible when fully scrolled in
        gsap.to(circleTextContainer, { opacity: 1, duration: 0.3 })
      },
      onLeaveBack: () => {
        // Hide text when scrolling back to previous section
        gsap.to(circleTextContainer, { opacity: 0, duration: 0.2 })
      }
    })
    
    // Create function to build text matching the reference image - REMOVED outer ring
    function createReferenceMatchingText(container, text) {
      container.innerHTML = ''
      const chars = text.split('')
      const charCount = chars.length
      
      // Create an inner container with smoother rotation
      const innerContainer = document.createElement('div')
      innerContainer.className = 'inner-text-container'
      innerContainer.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        animation: smoothRotate 40s linear infinite;
      `
      container.appendChild(innerContainer)
      
      // Calculate the radius for the text circle - larger to match reference
      const radius = 390 
      
      // Place each character in 3D space around a circle
      chars.forEach((char, i) => {
        // Calculate the angle for this character
        const angle = (i / charCount) * Math.PI * 2
        
        // Calculate 3D position using sine and cosine
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        
        // Create the character element with styling to match reference
        const charElement = document.createElement('div')
        charElement.className = 'reference-char'
        charElement.textContent = char
        charElement.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 900;
          font-size: 60px; /* Larger text to match reference */
          color: #F5F5DC;
          -webkit-text-stroke: 2px #000000;
          transform: translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${angle * 180 / Math.PI}deg);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          padding: 15px;
          width: 70px; /* Wider to match reference */
          height: 90px; /* Taller to match reference */
          display: flex;
          justify-content: center;
          align-items: center;
          filter: none; /* Remove shadow filter */
          text-transform: uppercase;
          letter-spacing: -1px;
          will-change: transform;
        `
        innerContainer.appendChild(charElement)
        
        // Add simple animation without shadows
        gsap.to(charElement, {
          opacity: 0.8,
          yoyo: true,
          repeat: -1,
          duration: 2.5 + Math.random() * 0.5,
          delay: i * 0.04,
        })
      })
      
      // NO OUTER RING - Removed as requested
    }
    
    return () => {
      // Clean up on unmount
      if (circleTextContainer && circleTextContainer.parentNode) {
        circleTextContainer.parentNode.removeChild(circleTextContainer)
      }
    }
  }, [showContent])

  return (
    <>
      {/* Flash overlay for transition effect */}
      <div ref={flashRef} className="flash-overlay"></div>
      
      {/* Lion SVG Drawing Animation */}
      <div className="svg-container fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.darkBg }}>
        <div ref={containerRef} className="svg-lion-container">
          {/* Render the SVG from the file */}
          <svg 
            ref={svgRef}
            className="lion-svg" 
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: processedSvgContent }}
          />
        </div>
      </div>

      {/* Main Content */}
      {showContent && (
        <div className="main w-full relative" style={{ backgroundColor: COLORS.darkBg }}>
          {/* First section with hero content */}
          <div className="landing overflow-hidden relative w-full h-screen z-[2]">
            {/* Minimal navbar */}
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-10 px-10 hero-element">
              <div className="flex justify-between items-center">
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-15 h-2" style={{ backgroundColor: COLORS.orange }}></div>
                  <div className="line w-8 h-2" style={{ backgroundColor: COLORS.yellow }}></div>
                  <div className="line w-5 h-2" style={{ backgroundColor: COLORS.blue }}></div>
                </div>
              </div>
            </div>

            {/* Simplified background - only Bg.png */}
            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              {/* Clean background image - only Bg.png - IMPROVED FOR PARALLAX */}
              <div className="absolute inset-0 z-10 parallax-bg"
                style={{
                  backgroundImage: 'url("/Bg.png")',
                  backgroundSize: 'cover', // Changed from 120% 120% to prevent stretching
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#0F172A', // Match background color to prevent black gaps
                  willChange: 'transform',
                  transform: 'scale(1.05)', // Reduced from 1.1 to minimize stretching
                  transformOrigin: 'center center'
                }}
                data-parallax-speed="0.15"> {/* Reduced speed for smoother effect */}
              </div>
              
              {/* GTA-style logo with Byte on top, Verse on bottom - improved alignment and width */}
              <div className="absolute top-[10%] left-0 w-full text-center z-20 parallax-text"
                   data-parallax-speed="-0.1">
                <div className="flex flex-col justify-center items-center max-w-[80vw] mx-auto">
                  <div className="gta-title-container relative inline-block">
                    {/* BYTE text - positioned on top with reduced width */}
                    <h1 className="gta-style-title font-black text-white relative z-10"
                        data-parallax-speed="-0.1">
                      <span className="block text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem]"
                        style={{
                          fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
                          color: "#F5F5DC", // Cream color to match the sign
                          textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                          WebkitTextStroke: '3px #000000',
                          letterSpacing: '-2px',
                          lineHeight: '0.9',
                          textTransform: 'uppercase',
                          fontWeight: '900',
                          opacity: '0.98',
                          maxWidth: '90%'
                        }}>
                        Byte
                      </span>
                    </h1>
                  </div>
                  
                  <div className="gta-title-container relative inline-block mt-0">
                    {/* VERSE text - positioned below with reduced width */}
                    <h1 className="gta-style-title font-black text-white relative z-10"
                        data-parallax-speed="-0.1">
                      <span className="block text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem]"
                        style={{
                          fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
                          color: "#F5F5DC", // Cream color to match the sign
                          textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                          WebkitTextStroke: '3px #000000',
                          letterSpacing: '-2px',
                          lineHeight: '0.9',
                          textTransform: 'uppercase',
                          fontWeight: '900',
                          opacity: '0.98',
                          maxWidth: '90%'
                        }}>
                        Verse
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
              
              {/* Featured character images - IMPROVED RESPONSIVE HANDLING */}
              <div className="absolute inset-x-0 bottom-0 z-30 gta-characters flex justify-between items-end">
                {/* Left character image (Gupta) - HIDDEN ON SMALLEST SCREENS */}
                <div className="character-container stable-element hidden sm:flex"
                    style={{
                      filter: 'drop-shadow(0px 0px 30px rgba(0,0,0,0.5))',
                      zIndex: 31,
                      flex: '1',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-end',
                      overflow: 'visible'
                    }}>
                  <img 
                    src="/Gupta.png" 
                    alt="Character"
                    className="w-auto object-contain character-image"
                    style={{
                      height: '90vh',
                      maxHeight: 'calc(100vh - 150px)',
                      objectPosition: 'bottom',
                      maxWidth: '100%',
                      transform: 'scale(1.1)',
                      transformOrigin: 'bottom center'
                    }}
                  />
                </div>
                
                {/* Center character image (Harsh) - ALWAYS SHOWN */}
                <div 
                  ref={centerHeroRef}
                  className="character-container stable-element"
                  style={{
                    filter: 'drop-shadow(0px 0px 40px rgba(0,0,0,0.6))',
                    zIndex: 35,
                    flex: '1.3',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    overflow: 'visible'
                  }}>
                  <img 
                    src="/Harsh.png" 
                    alt="Character"
                    className="w-auto object-contain character-image"
                    style={{
                      height: '100vh',
                      maxHeight: 'calc(100vh - 100px)',
                      objectPosition: 'bottom',
                      maxWidth: '110%',
                      transform: 'scale(1.15)',
                      transformOrigin: 'bottom center'
                    }}
                  />
                </div>
                
                {/* Right character image (Sarthik) - HIDDEN ON SMALLEST SCREENS */}
                <div className="character-container stable-element hidden sm:flex"
                    style={{
                      filter: 'drop-shadow(0px 0px 30px rgba(0,0,0,0.5))',
                      zIndex: 31,
                      flex: '1',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      overflow: 'visible'
                    }}>
                  <img 
                    src="/sarthik.png" 
                    alt="Character"
                    className="w-auto object-contain character-image"
                    style={{
                      height: '90vh',
                      maxHeight: 'calc(100vh - 150px)',
                      objectPosition: 'bottom',
                      maxWidth: '100%',
                      transform: 'scale(1.1)',
                      transformOrigin: 'bottom center'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Section with invitation and full image */}
          <div 
            ref={secondSectionRef}
            className="section-two py-20 px-6 md:px-16 relative z-[3]">
            {/* Background with BG_SECOND.png - FIXED TO ENSURE VISIBILITY */}
            <div className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url("/BG_SECOND.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%'
              }}>
              {/* Reduced opacity overlay for better image visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.55)] to-[rgba(30,41,59,0.45)]"></div>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-8 md:py-16">
                {/* Left side - ADJUSTED FOR MOBILE */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-start parallax-content" data-parallax-speed="0.05">
                  <div 
                    ref={clipImageRef}
                    className="full-image-container">
                    <FullImage imageUrl="/Harsh.png" />
                  </div>
                </div>
                
                {/* Right side - IMPROVED SPACING FOR MOBILE */}
                <div className="w-full md:w-1/2 text-left mt-8 md:mt-0 parallax-content" data-parallax-speed="-0.05">
                  <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-8 relative inline-block">
                    🚀 JOIN US AS A MENTOR
                    <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-gradient-to-r from-[#F7CD21] to-[#D26E1C]"></span>
                  </h2>
                  
                  <div className="space-y-4 md:space-y-6 text-base md:text-lg lg:text-xl text-gray-300 mentor-text-container">
                    <p className="leading-relaxed">
                      <span className="text-[#F7CD21] font-semibold">Sheryians Coding School</span> is more than an educational platform — it's a <span className="text-white font-semibold">movement to empower</span> the next generation of tech leaders. 
                      We're building a future where innovation, curiosity, and mentorship converge — and we invite you to be at the heart of it.
                    </p>
                    
                    <div className="pl-4 border-l-4 border-[#D26E1C] my-6">
                      <p className="italic text-white">
                        As a mentor, you'll play a pivotal role in shaping talented, driven minds.
                      </p>
                    </div>
                    
                    <p className="leading-relaxed">
                      Your expertise will not only educate — it will <span className="text-white font-semibold">inspire, transform, and elevate</span>. Whether it's through guiding projects, nurturing ideas, or sharing real-world insights, your impact will echo far beyond the classroom.
                    </p>
                    
                    <p className="text-xl font-medium text-[#F7CD21]">
                      This isn't just an opportunity to give back — it's a chance to lead forward.
                    </p>
                    
                    <div className="mt-10 p-6 rounded-lg bg-gradient-to-r from-[rgba(15,23,42,0.8)] to-[rgba(30,41,59,0.8)] backdrop-blur-sm border-l-4 border-[#F7CD21] shadow-lg">
                      <p className="font-semibold text-white text-xl">
                        If you believe in building a smarter tomorrow,<br />
                        <span className="text-[#F7CD21]">Sheryians Coding School</span> is where your mentorship journey begins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final section with slogan and centered image - RESTORED HARSH.PNG */}
          <div 
            ref={sloganSectionRef}
            className="slogan-section flex items-center justify-center relative z-[3] py-20">
            {/* Background with gradient */}
            <div className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'linear-gradient(180deg, #0F172A 0%, #111827 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                willChange: 'transform'
              }}
              data-parallax-speed="0.05">
            </div>

            {/* Background text that appears behind the image - INCREASED opacity to be visible */}
            <div className="absolute inset-0 flex items-center justify-center z-[1]">
              <div className="bg-text text-9xl font-black text-gray-800 opacity-[0.38]">
                BYTEVERSE
              </div>
            </div>
            
            {/* Centered image container - RESTORING HARSH.PNG */}
            <div 
              ref={finalImageRef}
              className="center-image-reference"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '0',
                transform: 'translateX(-50%)',
                zIndex: 50,
                height: '90vh', /* Slightly reduced for better mobile display */
                width: 'auto',
                maxWidth: '95vw', /* Prevent overflow */
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'flex-end',
              }}>
              <img 
                src="/Harsh.png"
                alt="ByteVerse Character"
                className="h-full w-auto object-contain"
                style={{
                  filter: 'none',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectPosition: 'bottom',
                }}
              />
            </div>
          </div>
          
        </div>
      )}
    </>
  )
}

export default App;
