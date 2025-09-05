import { createClient } from '@supabase/supabase-js';

const dbUrl = process.env.SUPABASE_URL;
const dbKey = process.env.SUPABASE_API_KEY;
export const dbClient = createClient(dbUrl!, dbKey!);
