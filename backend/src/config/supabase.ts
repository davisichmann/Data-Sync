import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role Key for backend ops

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing Supabase URL or Key in environment variables. DB operations will fail.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
