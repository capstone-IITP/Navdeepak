import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-body text-[#E5E5E5]">
            <div className="w-full max-w-sm p-8 border border-neutral-900 rounded-lg">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-4xl italic mb-2">Admin</h1>
                    <p className="text-xs uppercase tracking-widest text-neutral-500">Restricted Access</p>
                </div>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-neutral-800 pb-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-neutral-800 pb-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full text-xs uppercase tracking-[0.2em] bg-white text-black py-4 hover:bg-neutral-200 transition-colors mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
