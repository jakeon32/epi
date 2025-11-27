import { supabase } from '../lib/supabaseClient';

export const profileService = {
    async getProfile() {
        // Assuming single user profile for now, get the first row
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // If no rows found, return null or default
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    async updateProfile(id, updates) {
        const { data, error } = await supabase
            .from('profile')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    },

    async createProfile(profile) {
        const { data, error } = await supabase
            .from('profile')
            .insert([profile])
            .select();

        if (error) throw error;
        return data;
    }
};
