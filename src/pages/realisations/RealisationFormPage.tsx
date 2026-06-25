import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  realisationSchema,
  type RealisationInput,
} from '../../schemas/realisation.schema';
import {
  createRealisation,
  getRealisation,
  updateRealisation,
} from '../../lib/firestore/realisations';
import { slugify } from '../../lib/slug';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: RealisationInput = {
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  category: '',
  slug: '',
  images: [],
  coverImage: '',
  clientName: '',
  liveUrl: '',
  tags: [],
  published: false,
};

export default function RealisationFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [tagsText, setTagsText] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RealisationInput>({
    resolver: zodResolver(realisationSchema),
    defaultValues: EMPTY,
  });

  const images = useWatch({ control, name: 'images' }) ?? [];
  const coverImage = useWatch({ control, name: 'coverImage' }) ?? '';

  useEffect(() => {
    if (!id) return;
    getRealisation(id)
      .then((r) => {
        if (r) {
          reset({ ...EMPTY, ...r, liveUrl: r.liveUrl ?? '' });
          setTagsText((r.tags ?? []).join(', '));
        } else {
          showToast('Réalisation introuvable', 'error');
          navigate('/realisations');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: RealisationInput) {
    try {
      if (isEdit && id) {
        await updateRealisation(id, values);
        showToast('Réalisation mise à jour');
      } else {
        await createRealisation(values);
        showToast('Réalisation créée');
      }
      navigate('/realisations');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  function generateSlug() {
    setValue('slug', slugify(getValues('title.fr')), { shouldValidate: true });
  }

  function onTagsChange(text: string) {
    setTagsText(text);
    const tags = text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setValue('tags', tags);
  }

  if (loading) {
    return <p className="text-body">Chargement…</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/realisations"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux réalisations
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <Field
          label="Images"
          error={errors.images?.message ?? errors.coverImage?.message}
        >
          <ImageUploader
            images={images}
            coverImage={coverImage}
            folder="realisations"
            onChange={(imgs, cover) => {
              setValue('images', imgs, { shouldValidate: true });
              setValue('coverImage', cover, { shouldValidate: true });
            }}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Titre (FR)" error={errors.title?.fr?.message}>
            <input className={inputClass} {...register('title.fr')} />
          </Field>
          <Field label="Titre (EN)" error={errors.title?.en?.message}>
            <input className={inputClass} {...register('title.en')} />
          </Field>
        </div>

        <Field label="Description (FR)" error={errors.description?.fr?.message}>
          <RichTextEditor
            value={getValues('description.fr')}
            onChange={(html) =>
              setValue('description.fr', html, { shouldValidate: true })
            }
          />
        </Field>
        <Field label="Description (EN)" error={errors.description?.en?.message}>
          <RichTextEditor
            value={getValues('description.en')}
            onChange={(html) =>
              setValue('description.en', html, { shouldValidate: true })
            }
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Catégorie" error={errors.category?.message}>
            <input className={inputClass} {...register('category')} />
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
          <Field label="Client (optionnel)">
            <input className={inputClass} {...register('clientName')} />
          </Field>
          <Field
            label="Lien du site (optionnel)"
            error={errors.liveUrl?.message}
          >
            <input
              className={inputClass}
              placeholder="https://…"
              {...register('liveUrl')}
            />
          </Field>
        </div>

        <Field label="Tags (séparés par des virgules)">
          <input
            className={inputClass}
            value={tagsText}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="react, design, mobile"
          />
        </Field>

        <div className="flex items-center gap-2">
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

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/realisations">
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
