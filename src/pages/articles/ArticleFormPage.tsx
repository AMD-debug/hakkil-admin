import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import type { Membre } from '../../types/membre';
import { articleSchema, type ArticleInput } from '../../schemas/article.schema';
import {
  createArticle,
  getArticle,
  updateArticle,
} from '../../lib/firestore/articles';
import { slugify } from '../../lib/slug';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { useToast } from '../../components/ui/toast-context';

type Lang = 'fr' | 'en';

const EMPTY: ArticleInput = {
  title: { fr: '', en: '' },
  excerpt: { fr: '', en: '' },
  content: { fr: '', en: '' },
  coverImage: '',
  slug: '',
  author: '',
  tags: [],
  published: false,
};

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [lang, setLang] = useState<Lang>('fr');
  const [tagsText, setTagsText] = useState('');
  const [wasPublished, setWasPublished] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArticleInput>({
    resolver: zodResolver(articleSchema),
    defaultValues: EMPTY,
  });

  const coverImage = useWatch({ control, name: 'coverImage' }) ?? '';
  const { data: members } = useCollection<Membre>('equipe', [
    orderBy('order', 'asc'),
  ]);

  useEffect(() => {
    if (!id) return;
    getArticle(id)
      .then((a) => {
        if (a) {
          reset({ ...EMPTY, ...a });
          setTagsText((a.tags ?? []).join(', '));
          setWasPublished(a.published);
        } else {
          showToast('Article introuvable', 'error');
          navigate('/articles');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: ArticleInput) {
    try {
      if (isEdit && id) {
        await updateArticle(id, values, wasPublished);
        showToast('Article mis à jour');
      } else {
        await createArticle(values);
        showToast('Article créé');
      }
      navigate('/articles');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  function generateSlug() {
    setValue('slug', slugify(getValues('title.fr')), { shouldValidate: true });
  }

  function onTagsChange(text: string) {
    setTagsText(text);
    setValue(
      'tags',
      text
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    );
  }

  if (loading) {
    return <p className="text-body">Chargement…</p>;
  }

  const langHasError = (l: Lang) =>
    Boolean(errors.title?.[l] || errors.excerpt?.[l] || errors.content?.[l]);

  return (
    <div className="max-w-3xl">
      <Link
        to="/articles"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux articles
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? "Modifier l'article" : 'Nouvel article'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        {/* Onglets de langue */}
        <div className="flex gap-1 border-b border-gray-200">
          {(['fr', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium ${
                lang === l
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-ink'
              }`}
            >
              {l.toUpperCase()}
              {langHasError(l) && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Les deux langues sont montées en permanence (chacune garde sa valeur) ;
            seule la langue active est visible. */}
        {(['fr', 'en'] as Lang[]).map((l) => (
          <div key={l} className={l === lang ? 'space-y-5' : 'hidden'}>
            <Field
              label={`Titre (${l.toUpperCase()})`}
              error={errors.title?.[l]?.message}
            >
              <input className={inputClass} {...register(`title.${l}`)} />
            </Field>

            <Field
              label={`Extrait (${l.toUpperCase()})`}
              error={errors.excerpt?.[l]?.message}
            >
              <textarea
                rows={2}
                className={inputClass}
                {...register(`excerpt.${l}`)}
              />
            </Field>

            <Field
              label={`Contenu (${l.toUpperCase()})`}
              error={errors.content?.[l]?.message}
            >
              <RichTextEditor
                value={getValues(`content.${l}`)}
                onChange={(html) =>
                  setValue(`content.${l}`, html, { shouldValidate: true })
                }
              />
            </Field>
          </div>
        ))}

        <hr className="border-gray-100" />

        <Field label="Image de couverture" error={errors.coverImage?.message}>
          <ImagePicker
            value={coverImage}
            folder="articles"
            onChange={(url) =>
              setValue('coverImage', url, { shouldValidate: true })
            }
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Auteur" error={errors.author?.message}>
            <select className={inputClass} {...register('author')}>
              <option value="">— Choisir —</option>
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
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

        <Field label="Tags (séparés par des virgules)">
          <input
            className={inputClass}
            value={tagsText}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="actualité, tech, guinée"
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
          <Link to="/articles">
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
