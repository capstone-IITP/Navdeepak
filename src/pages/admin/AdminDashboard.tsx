import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    year: string;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [messages, setMessages] = useState<Contact[]>([]);
    const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchProjects();
        fetchMessages(token);
    }, [navigate]);

    const fetchProjects = async () => {
        const res = await fetch('/api/projects');
        if (res.ok) setProjects(await res.json());
    };

    const fetchMessages = async (token: string) => {
        const res = await fetch('/api/contact', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setMessages(await res.json());
    };

    const [showProjectModal, setShowProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '', slug: '', category: '', year: '', description: '', image: '', link: '', preview: '', tech_stack: '', github: ''
    });

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        
        // Convert tech_stack string to array
        const techStackArray = newProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
        
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ ...newProject, tech_stack: techStackArray })
        });
        
        if (res.ok) {
            setShowProjectModal(false);
            setNewProject({ title: '', slug: '', category: '', year: '', description: '', image: '', link: '', preview: '', tech_stack: '', github: '' });
            fetchProjects();
        } else {
            alert('Failed to create project');
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchProjects();
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-body">
            <nav className="border-b border-neutral-900 p-6 flex justify-between items-center bg-neutral-900/20 backdrop-blur-md sticky top-0 z-10">
                <div className="font-display text-2xl italic text-white tracking-widest">Dashboard</div>
                <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
                    Logout
                </button>
            </nav>

            <main className="p-6 md:p-12 max-w-7xl mx-auto">
                <div className="flex gap-8 border-b border-neutral-900 mb-8">
                    <button 
                        className={`pb-4 text-xs uppercase tracking-[0.2em] transition-colors ${activeTab === 'projects' ? 'text-white border-b border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>
                    <button 
                        className={`pb-4 text-xs uppercase tracking-[0.2em] transition-colors ${activeTab === 'messages' ? 'text-white border-b border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Messages
                    </button>
                </div>

                {activeTab === 'projects' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-3xl">All Projects</h2>
                            <button 
                                onClick={() => setShowProjectModal(true)}
                                className="bg-white text-black px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors"
                            >
                                + Add Project
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {projects.map(p => (
                                <div key={p.id} className="border border-neutral-900 bg-neutral-900/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-neutral-700 transition-colors">
                                    <div>
                                        <h3 className="font-display text-2xl text-white">{p.title}</h3>
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">/{p.slug} • {p.category}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => handleDeleteProject(p.id)} className="text-xs text-neutral-400 hover:text-red-500 uppercase tracking-widest">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && <p className="text-neutral-500 text-sm">No projects found.</p>}
                        </div>

                        {showProjectModal && (
                            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                                <div className="bg-[#050505] border border-neutral-900 w-full max-w-2xl p-6 md:p-8 relative mt-20 mb-20">
                                    <button 
                                        onClick={() => setShowProjectModal(false)}
                                        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <h2 className="font-display text-3xl mb-6">New Project</h2>
                                    <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required type="text" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                            <input required type="text" placeholder="Slug (e.g. project-name)" value={newProject.slug} onChange={e => setNewProject({...newProject, slug: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                            <input required type="text" placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                            <input required type="text" placeholder="Year" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        </div>
                                        <textarea required placeholder="Description" rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm resize-none"></textarea>
                                        <input required type="text" placeholder="Image URL (Hero gradient or URL)" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        <input type="text" placeholder="Preview Image URL" value={newProject.preview} onChange={e => setNewProject({...newProject, preview: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        <input type="text" placeholder="Live Link (optional)" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        <input type="text" placeholder="GitHub Link (optional)" value={newProject.github} onChange={e => setNewProject({...newProject, github: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        <input type="text" placeholder="Tech Stack (comma separated)" value={newProject.tech_stack} onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} className="bg-transparent border-b border-neutral-800 pb-2 focus:outline-none focus:border-white text-sm" />
                                        
                                        <button type="submit" className="mt-4 bg-white text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors">
                                            Save Project
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div>
                        <h2 className="font-display text-3xl mb-6">Contact Submissions</h2>
                        <div className="grid gap-4">
                            {messages.map(m => (
                                <div key={m.id} className="border border-neutral-900 bg-neutral-900/10 p-6 flex flex-col gap-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="font-medium text-white">{m.name}</h3>
                                            <a href={`mailto:${m.email}`} className="text-xs text-neutral-500 hover:text-white transition-colors">{m.email}</a>
                                        </div>
                                        <span className="text-xs text-neutral-600">{new Date(m.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-light leading-relaxed text-neutral-300 border-t border-neutral-900 pt-4 mt-2">
                                        {m.message}
                                    </p>
                                </div>
                            ))}
                            {messages.length === 0 && <p className="text-neutral-500 text-sm">No messages received yet.</p>}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
