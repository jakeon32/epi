import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f3f0] px-4">
            <div className="w-full max-w-md bg-white p-8 shadow-sm rounded-sm">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-light tracking-tight">Admin Login</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-gray-500 hover:text-black transition-colors"
                    >
                        ← Back to Site
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 text-sm mb-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
