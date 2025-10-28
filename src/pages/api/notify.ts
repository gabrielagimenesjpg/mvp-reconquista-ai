import type { NextApiRequest, NextApiResponse } from 'next';

// Endpoint genérico de automação (Make/Zapier)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, msg:'Method not allowed' });

  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_PLAN_CREATED; // URL do Make
  if (!webhookUrl) return res.status(200).json({ ok:true, msg:'no_webhook_configured' });

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await r.text();
    return res.status(200).json({ ok:true, provider_response: text.slice(0,1000) });
  } catch (e:any) {
    return res.status(200).json({ ok:false, msg: e?.message || 'fetch_failed' });
  }
}