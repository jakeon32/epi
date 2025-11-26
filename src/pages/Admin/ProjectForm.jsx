import React, { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        year: new Date().getFullYear().toString(),
        image_url: '',
        description: '',
        technologies: '', // Will be converted to array
        challenge: '',
        solution: '',
        display_order: 0
    });

    useEffect(() => {
        checkUser();
        if (isEditMode) {
            fetchProject();
        }
    }, [id]);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/admin');
        }
    };

    const fetchProject = async () => {
        try {
            const data = await projectService.getProject(id);
            setFormData({
                ...data,
                technologies: data.technologies.join(', ')
            });
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to load project');
            navigate('/admin/dashboard');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const projectData = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
                display_order: parseInt(formData.display_order) || 0
            };

            if (isEditMode) {
                await projectService.updateProject(id, projectData);
            } else {
                await projectService.createProject(projectData);
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f3f0]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f3f0] p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="bg-white p-8 shadow-sm rounded-sm">
                    <h1 className="text-2xl font-light mb-8 tracking-tight">
                        {isEditMode ? 'Edit Project' : 'New Project'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Display Order</label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                required
                                placeholder="https://..."
                            />
                            {formData.image_url && (
                                <div className="mt-2 h-40 w-full bg-gray-100 rounded-sm overflow-hidden">
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Project URL (Optional)</label>
                            <input
                                type="url"
                                name="project_url"
                                value={formData.project_url || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Technologies (comma separated)</label>
                            <input
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                placeholder="React, Tailwind CSS, Node.js"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-red-600">Challenge</label>
                                <textarea
                                    name="challenge"
                                    value={formData.challenge}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-green-600">Solution</label>
                                <textarea
                                    name="solution"
                                    value={formData.solution}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
