import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectData {
    id: number;
    title: string;
    description: string;
    category: string;
    year: string;
    image: string;
    link: string;
    preview: string;
    tech_stack: string[];
    github: string;
}

const ProjectDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex items-center justify-center font-body text-neutral-500 uppercase tracking-widest text-xs">Loading...</div>;
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex flex-col items-center justify-center font-body">
                <p className="text-neutral-500 mb-4">Project not found</p>
                <Link to="/" className="text-xs uppercase tracking-widest border-b border-white pb-1">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen w-full text-[#E5E5E5] font-sans selection:bg-white selection:text-black">
            <nav className="fixed top-0 w-full p-4 sm:p-6 md:p-8 flex justify-between items-center z-40 mix-blend-difference">
                <Link to="/" className="flex items-center gap-2 font-body font-bold text-xs sm:text-sm tracking-widest uppercase hover:text-neutral-400 transition-colors">
                    <ArrowLeft size={16} /> Back to Works
                </Link>
            </nav>

            <main className="pt-32 px-4 sm:px-6 md:px-16 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="mb-12">
                        <span className="block text-xs font-body tracking-[0.2em] uppercase text-neutral-500 mb-4">
                            {project.category} • {project.year}
                        </span>
                        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl mb-8 leading-[0.9]">{project.title}</h1>
                        <p className="font-body font-light text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-16">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-body font-medium uppercase tracking-[0.2em] bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors">
                                Visit Live Site <ArrowUpRight size={14} />
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-body font-medium uppercase tracking-[0.2em] border border-neutral-800 px-6 py-3 hover:bg-neutral-900 transition-colors">
                                Source Code <Github size={14} />
                            </a>
                        )}
                    </div>

                    {project.preview && (
                        <div className="w-full h-auto max-h-[80vh] overflow-hidden rounded-lg mb-16">
                            <img src={project.preview} alt={project.title} className="w-full object-cover" />
                        </div>
                    )}

                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="border-t border-neutral-900 pt-12">
                            <h3 className="font-display text-2xl italic text-neutral-500 mb-6">Technologies Used</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.tech_stack.map((tech, idx) => (
                                    <span key={idx} className="font-body text-xs text-neutral-400 px-4 py-2 bg-neutral-900 rounded-full">{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default ProjectDetails;
