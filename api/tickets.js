import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Получаем токен из заголовка Authorization: Bearer ...
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  // 2. Проверяем сессию в Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  // 3. Получаем Discord ID
  const discordId = String(data.user.app_metadata?.provider_id || data.user.user_metadata?.provider_id);
  if (!discordId) {
    return res.status(401).json({ error: 'No Discord ID' });
  }

  // 4. Проверяем, админ ли
  const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
  if (!ADMIN_IDS.includes(discordId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 5. Читаем tickets.json из GitHub (публичный raw URL)
  const ticketsRes = await fetch('https://raw.githubusercontent.com/RaynorTry/transcript/main/tickets.json');
  if (!ticketsRes.ok) {
    return res.status(500).json({ error: 'Failed to load tickets' });
  }
  const tickets = await ticketsRes.json();

  res.json(tickets);
}
