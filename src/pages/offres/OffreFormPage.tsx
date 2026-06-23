import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { offreSchema, type OffreInput } from '../../schemas/offre.schema';
import { createOffre, getOffre, updateOffre } from '../../lib/firestore/offres';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: OffreInput = {
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  price: '',
  features: { fr: [], en: [] },
  highlighted: false,
  order: 0,
  published: false,
};

const toLines = (arr: string[]) => arr.join('\n');
const fromLines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

export default function OffreFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [featFr, setFeatFr] = useState('');
  const [featEn, setFeatEn] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OffreInput>({
    resolver: zodResolver(offreSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!id) return;
    getOffre(id)
      .then((o) => {
        if (o) {
          reset({ ...EMPTY, ...o });
          setFeatFr(toLines(o.features?.fr ?? []));
          setFeatEn(toLines(o.features?.en ?? []));
        } else {
          showToast('Offre introuvable', 'error');
          navigate('/offres');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: OffreInput) {
    try {
      if (isEdit && id) {
        await updateOffre(id, values);
        showToast('Offre mise à jour');
      } else {
        await createOffre(values);
        showToast('Offre créée');
      }
      navigate('/offres');
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
        to="/offres"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux offres
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? "Modifier l'offre" : 'Nouvelle offre'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom du pack (FR)" error={errors.title?.fr?.message}>
            <input className={inputClass} {...register('title.fr')} />
          </Field>
          <Field label="Nom du pack (EN)" error={errors.title?.en?.message}>
            <input className={inputClass} {...register('title.en')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Accroche (FR)" error={errors.description?.fr?.message}>
            <input className={inputClass} {...register('description.fr')} />
          </Field>
          <Field label="Accroche (EN)" error={errors.description?.en?.message}>
            <input className={inputClass} {...register('description.en')} />
          </Field>
        </div>

        <Field
          label="Prix (ex. « 500 000 GNF » ou « Sur devis »)"
          error={errors.price?.message}
        >
          <input className={inputClass} {...register('price')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Inclus (FR) — une ligne par élément">
            <textarea
              rows={5}
              className={inputClass}
              value={featFr}
              onChange={(e) => {
                setFeatFr(e.target.value);
                setValue('features.fr', fromLines(e.target.value));
              }}
            />
          </Field>
          <Field label="Inclus (EN) — une ligne par élément">
            <textarea
              rows={5}
              className={inputClass}
              value={featEn}
              onChange={(e) => {
                setFeatEn(e.target.value);
                setValue('features.en', fromLines(e.target.value));
              }}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ordre d'affichage" error={errors.order?.message}>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register('order', { valueAsNumber: true })}
            />
          </Field>
          <div className="flex items-end gap-6 pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                {...register('highlighted')}
              />
              Mis en avant
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                {...register('published')}
              />
              Publié
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/offres">
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
