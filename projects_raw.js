import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react';

// Custom X (Twitter) Logo Component
const XLogo: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Portfolio: React.FC = () => {
    // --- Refs & State ---
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button'>('default');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Mouse position for custom cursor
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth mouse spring for cursor
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Detect touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Cursor Variants
    const variants = {
        default: {
            height: 16,
            width: 16,
            backgroundColor: "#ffffff",
            mixBlendMode: "difference" as const,
        },
        text: {
            height: 80,
            width: 80,
            backgroundColor: "#ffffff",
            mixBlendMode: "difference" as const,
        },
        button: {
            height: 48,
            width: 48,
            backgroundColor: "#ffffff",
            mixBlendMode: "difference" as const,
        }
    };

    const textEnter = () => setCursorVariant('text');
    const buttonEnter = () => setCursorVariant('button');
    const textLeave = () => setCursorVariant('default');

    return (
        <div ref={containerRef} className={`bg-[#050505] min-h-screen w-full text-[#E5E5E5] font-sans selection:bg-white selection:text-black overflow-x-hidden relative ${isTouchDevice ? '' : 'cursor-none'}`}>

            {/* --- Global Styles & Fonts --- */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Manrope:wght@200;300;400;500;600&display=swap');
        
        :root {
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'Manrope', sans-serif;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #050505;
        }

        .font-display { font-family: var(--font-display); }
        .font-body { font-family: var(--font-body); }

        /* Noise Texture */
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.07;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #050505; 
        }
        ::-webkit-scrollbar-thumb {
          background: #333; 
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

            {/* --- Noise Overlay --- */}
            <div className="noise-overlay" />

            {/* --- Custom Cursor (hidden on touch devices) --- */}
            {!isTouchDevice && (
                <motion.div
                    className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center"
                    style={{
                        x: cursorX,
                        y: cursorY,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    variants={variants}
                    animate={cursorVariant}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                />
            )}

            {/* --- Navigation --- */}
            <nav className="fixed top-0 w-full p-4 sm:p-6 md:p-8 flex justify-between items-center z-40 mix-blend-difference">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={buttonEnter}
                    onMouseLeave={textLeave}
                    className="font-body font-bold text-xs sm:text-sm tracking-widest uppercase"
                >
                    Navdeepak &copy;26
                </motion.div>

                {/* Desktop Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden md:flex gap-8 font-body text-xs tracking-[0.2em] uppercase"
                >
                    {['Work', 'About', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(item.toLowerCase());
                                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            onMouseEnter={buttonEnter}
                            onMouseLeave={textLeave}
                            className="relative group overflow-hidden"
                        >
                            <span className="block transition-transform duration-500 group-hover:-translate-y-full">{item}</span>
                            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 italic font-display">{item}</span>
                        </a>
                    ))}
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="md:hidden p-2 -mr-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </motion.button>
            </nav>

            {/* --- Mobile Menu Overlay --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#050505] z-[60] flex flex-col items-center justify-center"
                    >
                        <button
                            className="absolute top-4 right-4 p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={28} />
                        </button>
                        <nav className="flex flex-col items-center gap-8">
                            {['Work', 'About', 'Contact'].map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMobileMenuOpen(false);
                                        setTimeout(() => {
                                            const element = document.getElementById(item.toLowerCase());
                                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 300);
                                    }}
                                    className="font-display text-4xl italic text-neutral-400 hover:text-white transition-colors"
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Main Content --- */}
            <main>
                <HeroSection textEnter={textEnter} textLeave={textLeave} />
                <AboutSection textEnter={textEnter} textLeave={textLeave} />
                <CapabilitiesSection textEnter={textEnter} textLeave={textLeave} />
                <ProjectsSection textEnter={textEnter} textLeave={textLeave} />
                <LearningJourneySection textEnter={textEnter} textLeave={textLeave} />
                <ContactSection textEnter={textEnter} textLeave={textLeave} buttonEnter={buttonEnter} />
            </main>

            <footer className="w-full py-6 sm:py-8 px-4 text-center text-neutral-800 text-xs font-body uppercase tracking-widest relative z-10">
                <div>Designed & Built by Navdeepak</div>
                <a href="https://wa.me/+919311426586" target="_blank" rel="noopener noreferrer" className="block mt-2 hover:text-neutral-500 transition-colors">+91 93114 26586</a>
            </footer>
        </div>
    );
};

// --- Sections ---

interface SectionProps {
    textEnter: () => void;
    textLeave: () => void;
}

interface ContactSectionProps extends SectionProps {
    buttonEnter: () => void;
}

const HeroSection: React.FC<SectionProps> = ({ textEnter, textLeave }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-24 overflow-hidden">
            <div className="max-w-[90vw] z-10">
                <motion.h1
                    className="font-display text-[15vw] leading-[0.85] tracking-tighter mix-blend-difference"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={textEnter}
                    onMouseLeave={textLeave}
                    style={{ y: y1 }}
                >
                    <span className="block">Frontend</span>
                    <span className="block italic ml-[10vw] text-neutral-400">Developer</span>
                </motion.h1>

                <motion.div
                    className="mt-12 md:mt-24 ml-auto max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{ y: y2 }}
                >
                    <p className="font-body text-lg md:text-xl font-light text-neutral-300 leading-relaxed">
                        Crafting digital experiences where <span className="text-white font-medium">precision</span> meets <span className="font-display italic text-2xl">poetry</span>.
                        Building the next generation of the web with clean code and cinematic motion.
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-6 md:left-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <div className="flex items-center gap-4 text-xs tracking-widest uppercase font-body text-neutral-500">
                    <span className="w-12 h-[1px] bg-neutral-700"></span>
                    Scroll to explore
                </div>
            </motion.div>
        </section>
    );
};

const AboutSection: React.FC<SectionProps> = ({ textEnter, textLeave }) => {
    return (
        <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 border-t border-neutral-900 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="md:col-span-4">
                    <span className="block text-xs font-body tracking-[0.2em] uppercase text-neutral-500 mb-6 md:mb-8">
                        01 / The Vision
                    </span>

                    {/* Mobile Profile Photo */}
                    <div className="md:hidden flex justify-center mb-8">
                        <div className="relative w-40 h-40">
                            <img
                                src="/profile.png"
                                alt="Navdeepak"
                                className="w-full h-full object-cover rounded-full grayscale"
                            />
                        </div>
                    </div>

                    {/* Desktop Profile Photo with Spinning Text */}
                    <div className="sticky top-32 hidden md:block relative">
                        {/* Profile Photo in Center */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <img
                                src="/profile.png"
                                alt="Navdeepak"
                                className="w-60 h-60 object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        {/* Spinning Text */}
                        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow opacity-30">
                            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                            <text>
                                <textPath href="#circlePath" fill="currentColor" className="text-[14px] font-body uppercase tracking-widest">
                                    Design • Development • Interaction • Motion •
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                <div className="md:col-span-8">
                    <AnimatedText
                        text="I don't just write code; I compose interfaces."
                        className="font-display text-3xl sm:text-4xl md:text-6xl mb-8 md:mb-12 leading-tight"
                        onHover={textEnter}
                        onLeave={textLeave}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 font-body text-neutral-400 font-light leading-relaxed text-sm sm:text-base">
                        <p>
                            My background blends design sense with solid frontend development. I see the web as a space where structure and creativity work together.
                        </p>
                        <p>
                            I currently focus on the React ecosystem, paying close attention to clean UI, smooth interactions, accessibility, and performance. Every detail is thoughtfully crafted.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CapabilitiesSection: React.FC<SectionProps> = ({ textEnter, textLeave }) => {
    const capabilities = [
        {
            title: "Semantic HTML",
            description: "Writing clean, accessible, and SEO-friendly markup"
        },
        {
            title: "Modern CSS & Layouts",
            description: "Responsive layouts using Flexbox, Grid, and Tailwind CSS"
        },
        {
            title: "JavaScript Fundamentals",
            description: "Handling UI logic, DOM manipulation, and basic interactivity"
        },
        {
            title: "Responsive Design",
            description: "Mobile-first approach across all screen sizes"
        },
        {
            title: "UI Animations",
            description: "Smooth hover effects, transitions, and scroll-based animations"
        },
        {
            title: "Component-Based UI",
            description: "Reusable UI components using React"
        }
    ];