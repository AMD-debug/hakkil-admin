import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../../lib/firestore/settings';
import type { SiteSettings } from '../../types/settings';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useToast } from '../../components/ui/toast-context';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteSettings>({});

  useEffect(() => {
    getSettings()
      .then(setForm)
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      showToast('Paramètres enregistrés');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-body">Chargement…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">Paramètres</h1>
      <p className="mt-1 text-sm text-body">
        Coordonnées affichées sur le site (footer, bouton WhatsApp, contact).
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <Field label="Téléphone (affichage)">
          <input
            className={inputClass}
            placeholder="+224 6XX XX XX XX"
            value={form.phone ?? ''}
            onChange={(e) => set('phone', e.target.value)}
          />
        </Field>
        <Field label="WhatsApp (numéro international sans symboles)">
          <input
            className={inputClass}
            placeholder="224600000000"
            value={form.whatsapp ?? ''}
            onChange={(e) => set('whatsapp', e.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            className={inputClass}
            placeholder="contact@hakkildigital.xyz"
            value={form.email ?? ''}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>
        <Field label="Adresse">
          <input
            className={inputClass}
            placeholder="Conakry, Guinée"
            value={form.address ?? ''}
            onChange={(e) => set('address', e.target.value)}
          />
        </Field>

        <div className="flex justify-end border-t border-gray-100 pt-5">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-xs text-body/60">
        Note : le site lit ces coordonnées au build. Un nouveau déploiement est
        nécessaire pour qu'elles apparaissent en production.
      </p>
    </div>
  );
}
