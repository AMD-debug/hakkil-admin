import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  partenaireSchema,
  type PartenaireInput,
} from '../../schemas/partenaire.schema';
import {
  createPartenaire,
  getPartenaire,
  updatePartenaire,
} from '../../lib/firestore/partenaires';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { useToast } from '../../components/ui/toast-context';

const EMPTY: PartenaireInput = { name: '', logo: '', url: '', order: 0 };

export default function PartenaireFormPage() {
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
  } = useForm<PartenaireInput>({
    resolver: zodResolver(partenaireSchema),
    defaultValues: EMPTY,
  });

  const logo = useWatch({ control, name: 'logo' }) ?? '';

  useEffect(() => {
    if (!id) return;
    getPartenaire(id)
      .then((p) => {
        if (p) reset({ ...EMPTY, ...p });
        else {
          showToast('Partenaire introuvable', 'error');
          navigate('/partenaires');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(values: PartenaireInput) {
    try {
      if (isEdit && id) {
        await updatePartenaire(id, values);
        showToast('Partenaire mis à jour');
      } else {
        await createPartenaire(values);
        showToast('Partenaire créé');
      }
      navigate('/partenaires');
    } catch {
      showToast("Erreur lors de l'enregistrement", 'error');
    }
  }

  if (loading) return <p className="text-body">Chargement…</p>;

  return (
    <div className="max-w-2xl">
      <Link
        to="/partenaires"
        className="mb-4 inline-flex items-center gap-2 text-sm text-body hover:text-ink"
      >
        <ArrowLeft size={16} />
        Retour aux partenaires
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isEdit ? 'Modifier le partenaire' : 'Nouveau partenaire'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <Field label="Logo" error={errors.logo?.message}>
          <ImagePicker
            value={logo}
            folder="partenaires"
            onChange={(url) => setValue('logo', url, { shouldValidate: true })}
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

        <Field label="Lien (optionnel)" error={errors.url?.message}>
          <input
            className={inputClass}
            placeholder="https://…"
            {...register('url')}
          />
        </Field>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <Link to="/partenaires">
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
