import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  temoignageSchema,
  type TemoignageInput,
} from '../../schemas/temoignage.schema';
import {
  createTemoignage,
  getTemoignage,
  updateTemoignage,
} from '../../lib/firestore/temoignages';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { StarRating } from '../../components/ui/StarRating';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: TemoignageInput = {
  clientName: '',
  company: '',
  content: { fr: '', en: '' },
  rating: 5,
  approved: false,
};

export default function TemoignageFormPage() {
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
  } = useForm<TemoignageInput>({
    resolver: zodResolver(temoignageSchema),
    defaultValues: EMPTY,
  });

  const rating = useWatch({ control, name: 'rating' }) ?? 0;

  useEffect(() => {
    if (!id) return;
    getTemoignage(id)
      .then((t) => {
        if (t) {
          reset({ ...EMPTY, ...t });
        } else {
          showToast('Témoignage introuvable', 'error');
          navigate('/temoignages');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: TemoignageInput) {
    try {
      if (isEdit && id) {
        await updateTemoignage(id, values);
        showToast('Témoignage mis à jour');
      } else {
        await createTemoignage(values);
        showToast('Témoignage créé');
      }
      navigate('/temoignages');
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
        to="/temoignages"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux témoignages
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier le témoignage' : 'Nouveau témoignage'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom du client" error={errors.clientName?.message}>
            <input className={inputClass} {...register('clientName')} />
          </Field>
          <Field label="Société (optionnel)">
            <input className={inputClass} {...register('company')} />
          </Field>
        </div>

        <Field label="Note" error={errors.rating?.message}>
          <StarRating
            value={rating}
            onChange={(n) => setValue('rating', n, { shouldValidate: true })}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Témoignage (FR)" error={errors.content?.fr?.message}>
            <textarea
              rows={4}
              className={inputClass}
              {...register('content.fr')}
            />
          </Field>
          <Field label="Témoignage (EN)" error={errors.content?.en?.message}>
            <textarea
              rows={4}
              className={inputClass}
              {...register('content.en')}
            />
          </Field>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="approved"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            {...register('approved')}
          />
          <label htmlFor="approved" className="text-sm text-gray-700">
            Approuvé (visible sur le site)
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/temoignages">
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
