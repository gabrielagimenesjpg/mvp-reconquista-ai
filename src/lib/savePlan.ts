import { supa } from './supa';

export type PlanPayload = {
  user_email?: string;
  fase: string;
  diagnostico_curto: string;
  status_emocional: string;
  acao_sugerida: string;
  mensagem_do_dia: string;
  alertas?: string[];
  checkin_pergunta: string;
  dia_plano: number;
  created_at?: string;
};

export async function savePlanSafe(payload: PlanPayload) {
  if (!supa) return { ok: false, reason: 'no_supabase' };
  try {
    const { error } = await supa.from('plans').insert({
      ...payload,
      created_at: new Date().toISOString()
    } as any);
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (e:any) {
    return { ok: false, reason: e?.message || 'unknown' };
  }
}