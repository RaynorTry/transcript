import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ is_admin: false });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.getUser(authHeader.split(' ')[1]);
  if (error || !data.user) return res.status(401).json({ is_admin: false });

  const discordId = String(data.user.app_metadata?.provider_id || data.user.user_metadata?.provider_id);
  const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
  console.log('ADMIN_IDS from env:', process.env.ADMIN_IDS);
  console.log('Parsed ADMIN_IDS:', ADMIN_IDS);

  res.json({ is_admin: ADMIN_IDS.includes(discordId) });
}
