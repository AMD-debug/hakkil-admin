import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { membreSchema, type MembreInput } from '../../schemas/membre.schema';
import {
  createMembre,
  getMembre,
  updateMembre,
} from '../../lib/firestore/equipe';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: MembreInput = {
  name: '',
  role: { fr: '', en: '' },
  photo: '',
  bio: { fr: '', en: '' },
  linkedin: '',
  github: '',
  facebook: '',
  whatsapp: '',
  order: 0,
};

export default function MembreFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MembreInput>({
    resolver: zodResolver(membreSchema),
    defaultValues: EMPTY,
  });

  const photo = useWatch({ control, name: 'photo' }) ?? '';

  useEffect(() => {
    if (!id) return;
    getMembre(id)
      .then((m) => {
        if (m) {
          reset({ ...EMPTY, ...m });
        } else {
          showToast('Membre introuvable', 'error');
          navigate('/equipe');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: MembreInput) {
    try {
      if (isEdit && id) {
        await updateMembre(id, values);
        showToast('Membre mis à jour');
      } else {
        await createMembre(values);
        showToast('Membre créé');
      }
      navigate('/equipe');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  if (loading) {
    return <p className="text-body">Chargement…</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/equipe"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour à l'équipe
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier le membre' : 'Nouveau membre'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <Field label="Photo" error={errors.photo?.message}>
          <ImagePicker
            value={photo}
            folder="equipe"
            onChange={(url) => setValue('photo', url, { shouldValidate: true })}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom" error={errors.name?.message}>
            <input className={inputClass} {...register('name')} />
          </Field>
          <Field label="Ordre d'affichage" error={errors.order?.message}>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register('order', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rôle (FR)" error={errors.role?.fr?.message}>
            <input className={inputClass} {...register('role.fr')} />
          </Field>
          <Field label="Rôle (EN)" error={errors.role?.en?.message}>
            <input className={inputClass} {...register('role.en')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Bio (FR)" error={errors.bio?.fr?.message}>
            <textarea rows={3} className={inputClass} {...register('bio.fr')} />
          </Field>
          <Field label="Bio (EN)" error={errors.bio?.en?.message}>
            <textarea rows={3} className={inputClass} {...register('bio.en')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="LinkedIn (optionnel)" error={errors.linkedin?.message}>
            <input
              className={inputClass}
              placeholder="https://linkedin.com/in/…"
              {...register('linkedin')}
            />
          </Field>
          <Field label="GitHub (optionnel)" error={errors.github?.message}>
            <input
              className={inputClass}
              placeholder="https://github.com/…"
              {...register('github')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Facebook (optionnel)" error={errors.facebook?.message}>
            <input
              className={inputClass}
              placeholder="https://facebook.com/…"
              {...register('facebook')}
            />
          </Field>
          <Field label="WhatsApp (optionnel)" error={errors.whatsapp?.message}>
            <input
              className={inputClass}
              placeholder="+224… ou https://wa.me/…"
              {...register('whatsapp')}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/equipe">
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
