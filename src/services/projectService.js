import { supabase } from '../lib/supabaseClient';

export const projectService = {
    async getProjects() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getProject(id) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createProject(project) {
        const { data, error } = await supabase
            .from('projects')
            .insert([project])
            .select();

        if (error) throw error;
        return data;
    },

    async updateProject(id, updates) {
        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    },

    async deleteProject(id) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
