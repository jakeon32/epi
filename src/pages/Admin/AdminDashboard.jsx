import React, { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService';
import { profileService } from '../../services/profileService';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Loader2, Save } from 'lucide-react';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState({ email: '', instagram_url: '', linkedin_url: '' });
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchData();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/admin');
        }
    };

    const fetchData = async () => {
        // Fetch Projects
        try {
            const projectsData = await projectService.getProjects();
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }

        // Fetch Profile
        try {
            const profileData = await profileService.getProfile();
            if (profileData) {
                setProfile(profileData);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project');
            }
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            if (profile.id) {
                await profileService.updateProfile(profile.id, profile);
            } else {
                const newProfile = await profileService.createProfile(profile);
                setProfile(newProfile[0]);
            }
            alert('Contact info updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update contact info');
        } finally {
            setSavingProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f3f0]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f3f0] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/projects/new"
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Project
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white text-black border border-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white shadow-sm rounded-sm p-8 mb-8">
                    <h2 className="text-xl font-light mb-6 border-b border-gray-100 pb-4">Contact Information</h2>
                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email || ''}
                                onChange={handleProfileChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                                placeholder="hello@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram_url"
                                value={profile.instagram_url || ''}
                                onChange={handleProfileChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">LinkedIn URL</label>
                            <input
                                type="text"
                                name="linkedin_url"
                                value={profile.linkedin_url || ''}
                                onChange={handleProfileChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Project List Section */}
                <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-xl font-light">Projects</h2>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Image</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Title</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Year</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Highlight</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 w-24">
                                        <img src={project.image_url} alt={project.title} className="w-16 h-10 object-cover rounded-sm bg-gray-200" />
                                    </td>
                                    <td className="p-4 font-medium">{project.title}</td>
                                    <td className="p-4 text-gray-500">{project.category}</td>
                                    <td className="p-4 text-gray-500">{project.year}</td>
                                    <td className="p-4 text-center">
                                        {project.is_highlight ? (
                                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                        ) : (
                                            <span className="inline-block w-2 h-2 bg-gray-200 rounded-full"></span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/projects/edit/${project.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                                        No projects found. Create your first project!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
