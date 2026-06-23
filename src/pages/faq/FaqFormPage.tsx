import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { faqSchema, type FaqInput } from '../../schemas/faq.schema';
import { createFaq, getFaq, updateFaq } from '../../lib/firestore/faq';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: FaqInput = {
  question: { fr: '', en: '' },
  answer: { fr: '', en: '' },
  order: 0,
  published: false,
};

export default function FaqFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!id) return;
    getFaq(id)
      .then((f) => {
        if (f) reset({ ...EMPTY, ...f });
        else {
          showToast('Question introuvable', 'error');
          navigate('/faq');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: FaqInput) {
    try {
      if (isEdit && id) {
        await updateFaq(id, values);
        showToast('Question mise à jour');
      } else {
        await createFaq(values);
        showToast('Question créée');
      }
      navigate('/faq');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  if (loading) return <p className="text-body">Chargement…</p>;

  return (
    <div className="max-w-3xl">
      <Link
        to="/faq"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour à la FAQ
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier la question' : 'Nouvelle question'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Question (FR)" error={errors.question?.fr?.message}>
            <input className={inputClass} {...register('question.fr')} />
          </Field>
          <Field label="Question (EN)" error={errors.question?.en?.message}>
            <input className={inputClass} {...register('question.en')} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Réponse (FR)" error={errors.answer?.fr?.message}>
            <textarea
              rows={4}
              className={inputClass}
              {...register('answer.fr')}
            />
          </Field>
          <Field label="Réponse (EN)" error={errors.answer?.en?.message}>
            <textarea
              rows={4}
              className={inputClass}
              {...register('answer.en')}
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
          <Link to="/faq">
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
