import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { serviceSchema, type ServiceInput } from '../../schemas/service.schema';
import {
  createService,
  getService,
  updateService,
} from '../../lib/firestore/services';
import { slugify } from '../../lib/slug';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: ServiceInput = {
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  longDescription: { fr: '', en: '' },
  icon: '',
  slug: '',
  order: 0,
  published: false,
};

export default function ServiceFormPage() {
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
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!id) return;
    getService(id)
      .then((service) => {
        if (service) {
          reset({ ...EMPTY, ...service });
        } else {
          showToast('Service introuvable', 'error');
          navigate('/services');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: ServiceInput) {
    try {
      if (isEdit && id) {
        await updateService(id, values);
        showToast('Service mis à jour');
      } else {
        await createService(values);
        showToast('Service créé');
      }
      navigate('/services');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  function generateSlug() {
    setValue('slug', slugify(getValues('title.fr')), { shouldValidate: true });
  }

  if (loading) {
    return <p className="text-body">Chargement…</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/services"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux services
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier le service' : 'Nouveau service'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Titre (FR)" error={errors.title?.fr?.message}>
            <input className={inputClass} {...register('title.fr')} />
          </Field>
          <Field label="Titre (EN)" error={errors.title?.en?.message}>
            <input className={inputClass} {...register('title.en')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Description (FR)"
            error={errors.description?.fr?.message}
          >
            <textarea
              rows={3}
              className={inputClass}
              {...register('description.fr')}
            />
          </Field>
          <Field
            label="Description (EN)"
            error={errors.description?.en?.message}
          >
            <textarea
              rows={3}
              className={inputClass}
              {...register('description.en')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Description longue (FR)">
            <textarea
              rows={4}
              className={inputClass}
              {...register('longDescription.fr')}
            />
          </Field>
          <Field label="Description longue (EN)">
            <textarea
              rows={4}
              className={inputClass}
              {...register('longDescription.en')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Icône (nom lucide ou URL)" error={errors.icon?.message}>
            <input className={inputClass} {...register('icon')} />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <div className="flex gap-2">
              <input className={inputClass} {...register('slug')} />
              <Button type="button" variant="secondary" onClick={generateSlug}>
                Générer
              </Button>
            </div>
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
          <div className="flex items-center gap-2 pt-7">
            <input
              id="published"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              {...register('published')}
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Publié
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/services">
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
