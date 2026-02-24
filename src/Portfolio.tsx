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

    return (
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16">
            {/* Section Header */}
            <div className="mb-12 md:mb-20">
                <motion.span
                    className="block text-xs font-body tracking-[0.2em] uppercase text-neutral-600 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    What I build using frontend technologies
                </motion.span>
                <motion.h2
                    className="font-display text-4xl sm:text-5xl md:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    onMouseEnter={textEnter}
                    onMouseLeave={textLeave}
                >
                    Capabilities
                </motion.h2>
                <div className="mt-8 w-full h-[1px] bg-neutral-800/50" />
            </div>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-16 gap-y-10 md:gap-y-16">
                {capabilities.map((capability, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group"
                        onMouseEnter={textEnter}
                        onMouseLeave={textLeave}
                    >
                        <h3 className="font-body font-medium text-xl md:text-2xl text-neutral-200 mb-3 group-hover:text-white transition-colors duration-300">
                            {capability.title}
                        </h3>
                        <p className="font-body font-light text-sm md:text-base text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors duration-300">
                            {capability.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

interface Project {
    id: number;
    title: string;
    category: string;
    year: string;
    description: string;
    image: string;
    link?: string;
    preview?: string;
}

const ProjectsSection: React.FC<SectionProps> = ({ textEnter, textLeave }) => {
    const projects: Project[] = [
        {
            id: 1,
            title: "Oscillinx",
            category: "LLM / SaaS",
            year: "2025",
            description: "An advanced Large Language Model (LLM) platform providing powerful natural language processing and intelligent conversational capabilities.",
            image: "linear-gradient(to bottom right, #1a1a1a, #000)",
            link: "https://oscillinx.in",
            preview: "https://i.ibb.co/PZx8xCxX/image.png"
        },
        {
            id: 2,
            title: "DecorMind",
            category: "AI Room Designer / SaaS",
            year: "2025",
            description: "An immersive furniture discovery platform featuring 3D product configurations and mood-based filtering.",
            image: "linear-gradient(to bottom right, #1a1a1a, #000)",
            link: "https://decormindai.vercel.app",
            preview: "https://i.ibb.co/DgMF4HSg/screencapture-decormindai-vercel-app-2026-01-12-15-15-38.png"
        },
        {
            id: 3,
            title: "DineStack",
            category: "Restaurant Management / SaaS",
            year: "2026",
            description: "A comprehensive restaurant management platform featuring QR table ordering, real-time analytics, and seamless integration across web and desktop.",
            image: "linear-gradient(to bottom right, #000, #1a1a1a)",
            link: "https://dinestack.in",
            preview: "https://i.ibb.co/67pnn6Sw/image.png"
        },
    ];

    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    return (
        <section id="work" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 relative">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-12 md:mb-24">
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl">Selected Works</h2>
                <span className="text-xs font-body tracking-[0.2em] uppercase text-neutral-500">03 / Case Studies</span>
            </div>

            <div className="flex flex-col">
                {projects.map((project) => (
                    <ProjectItem
                        key={project.id}
                        project={project}
                        setHovered={setHoveredProject}
                        isHovered={hoveredProject === project.id}
                        textEnter={textEnter}
                        textLeave={textLeave}
                    />
                ))}
            </div>
        </section>
    );
};

interface ProjectItemProps {
    project: Project;
    setHovered: (id: number | null) => void;
    isHovered: boolean;
    textEnter: () => void;
    textLeave: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, setHovered, isHovered, textEnter, textLeave }) => {
    return (
        <motion.div
            className="group border-t border-neutral-900 py-12 md:py-16 relative cursor-pointer"
            onMouseEnter={() => {
                setHovered(project.id);
                textEnter();
            }}
            onMouseLeave={() => {
                setHovered(null);
                textLeave();
            }}
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between z-10 relative mix-blend-difference">
                <h3 className="font-display text-4xl md:text-6xl italic text-neutral-400 group-hover:text-white transition-colors duration-500">
                    {project.title}
                </h3>
                <div className="flex flex-col md:items-end mt-4 md:mt-0">
                    <span className="font-body text-xs uppercase tracking-widest text-neutral-500 mb-1">{project.category}</span>
                    <span className="font-body text-xs text-neutral-600">{project.year}</span>
                </div>
            </div>

            <motion.div
                className="mt-6 max-w-lg"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
            >
                <p className="font-body font-light text-neutral-400 text-sm md:text-base leading-relaxed">
                    {project.description}
                </p>
                <div className="mt-4 flex gap-2">
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white border-b border-white pb-1 hover:opacity-80 transition-opacity">View Case <ArrowUpRight size={12} /></a>
                    )}
                </div>
            </motion.div>

            {/* Floating Image Preview */}
            <motion.div
                className="absolute top-1/2 right-10 md:right-1/4 w-[300px] h-[200px] md:w-[400px] md:h-[280px] z-0 overflow-hidden hidden md:block rounded-lg cursor-pointer"
                style={{
                    background: '#1a1a1a',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{
                    scale: isHovered ? 1 : 0.8,
                    opacity: isHovered ? 1 : 0,
                    rotate: isHovered ? 0 : -5,
                    x: isHovered ? 20 : 0
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => project.link && window.open(project.link, '_blank')}
            >
                {project.preview ? (
                    <div className="w-full h-full overflow-hidden">
                        <img
                            src={project.preview}
                            alt={`${project.title} Preview`}
                            className="w-full object-cover object-top"
                            style={{
                                animation: isHovered ? 'scrollPreview 8s ease-in-out infinite' : 'none',
                            }}
                        />
                        <style>{`
                            @keyframes scrollPreview {
                                0%, 5% { transform: translateY(0); }
                                45%, 55% { transform: translateY(calc(-100% + 280px)); }
                                95%, 100% { transform: translateY(0); }
                            }
                        `}</style>
                    </div>
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600 font-display italic text-2xl">
                        {project.title} Preview
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10" />
            </motion.div>
        </motion.div>
    );
};

const LearningJourneySection: React.FC<SectionProps> = ({ textEnter, textLeave }) => {
    const timeline = [
        { year: "2024", role: "Frontend Development", company: "Self-Learning", desc: "Building responsive UIs with HTML, CSS, JavaScript. Working with Next.js. Developing real-world projects like DecorMind and this portfolio." },
        { year: "2023", role: "Foundations", company: "Learning Phase", desc: "Learned core web development fundamentals. Practiced layouts, responsiveness, and CSS animations. Explored UI/UX principles." },
    ];

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 border-t border-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="md:col-span-4">
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Learning Journey</h2>
                    <span className="block mt-4 text-xs font-body tracking-[0.2em] uppercase text-neutral-500">
                        04 / Growth
                    </span>
                </div>
                <div className="md:col-span-8 space-y-10 md:space-y-16">
                    {timeline.map((item, i) => (
                        <div key={i} className="group relative pl-8 border-l border-neutral-800" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                            <span className="absolute -left-[5px] top-2 w-[9px] h-[9px] bg-neutral-800 rounded-full group-hover:bg-white transition-colors duration-300"></span>
                            <span className="block text-xs font-mono text-neutral-500 mb-2">{item.year}</span>
                            <h3 className="font-display text-xl sm:text-2xl text-white italic">{item.role}</h3>
                            <h4 className="font-body text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400 mt-1">{item.company}</h4>
                            <p className="font-body font-light text-sm sm:text-base text-neutral-500 mt-4 max-w-md">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const ContactSection: React.FC<ContactSectionProps> = ({ textEnter, textLeave, buttonEnter }) => {
    return (
        <section id="contact" className="min-h-[60vh] sm:min-h-[80vh] flex flex-col justify-between py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-neutral-900/20 relative overflow-hidden">

            {/* Big typography background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-[0.03] pointer-events-none select-none overflow-visible">
                <span className="font-display text-[18vw] leading-none whitespace-nowrap">CONTACT</span>
            </div>

            <div>
                <span className="block text-xs font-body tracking-[0.2em] uppercase text-neutral-500 mb-6 sm:mb-8">
                    05 / What's Next?
                </span>
                <h2
                    className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl max-w-4xl leading-[0.9]"
                    onMouseEnter={textEnter}
                    onMouseLeave={textLeave}
                >
                    Let's build something <span className="italic text-neutral-500">meaningful</span> together.
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end mt-12 md:mt-24">
                <div className="overflow-hidden">
                    <a
                        href="mailto:jnavdeepak143@gmail.com"
                        className="inline-block relative group"
                        onMouseEnter={buttonEnter}
                        onMouseLeave={textLeave}
                    >
                        <span className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl border-b border-transparent group-hover:border-white transition-all pb-1 break-all sm:break-normal">
                            jnavdeepak143@gmail.com
                        </span>
                        <ArrowUpRight className="inline-block ml-2 mb-1 sm:mb-2 text-neutral-500 group-hover:text-white transition-colors" size={18} />
                    </a>
                </div>

                <div className="flex gap-8 md:justify-end">
                    {[
                        { icon: Github, label: 'Github', url: 'https://github.com/capstone-IITP' },
                        { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/jnavdeepak143/' },
                        { icon: XLogo, label: 'X', url: 'https://x.com/NAVDEEPAK610333' }
                    ].map((social, i) => (
                        <a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors uppercase text-xs tracking-widest font-body"
                            onMouseEnter={buttonEnter}
                            onMouseLeave={textLeave}
                        >
                            <social.icon size={16} />
                            <span className="hidden sm:inline">{social.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Utilities ---

interface AnimatedTextProps {
    text: string;
    className: string;
    onHover: () => void;
    onLeave: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className, onHover, onLeave }) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    } as const;

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={className}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {words.map((word, index) => (
                <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default Portfolio;
