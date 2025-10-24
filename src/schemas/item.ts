import { z } from 'zod';

export const ItemTypes = ['single', 'multiple', 'open'] as const;
export type ItemType = (typeof ItemTypes)[number];

export const CognitiveLevels = ['remember', 'apply', 'transfer'] as const;
export type CognitiveLevel = (typeof CognitiveLevels)[number];

export const Difficulties = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof Difficulties)[number];

export const ItemSchema = z
  .object({
    id: z.string().optional(),
    subjectId: z.string(),
    topicId: z.string(),
    type: z.enum(ItemTypes),
    statement: z.string().min(10, 'El enunciado debe tener al menos 10 caracteres.'),
    choices: z
      .array(
        z.object({
          id: z.string(),
          text: z.string().min(1, 'El texto de la opción no puede estar vacío.'),
          correct: z.boolean(),
        })
      )
      .optional(),
    answer: z.string().optional(),
    difficulty: z.enum(Difficulties),
    cognitiveLevel: z.enum(CognitiveLevels),
    timeExpectedSec: z
      .number({ invalid_type_error: 'Debe ser un número' })
      .int()
      .min(10, 'El tiempo debe ser de al menos 10 segundos.')
      .max(900, 'El tiempo no puede exceder los 900 segundos.'),
    tags: z.array(z.string()).default([]),
    metadata: z.record(z.any()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'open') {
        return data.answer && data.answer.length > 0;
      }
      return data.choices && data.choices.length >= 2;
    },
    {
      message:
        'Para preguntas abiertas, la respuesta es obligatoria. Para opción múltiple/única, se requieren al menos 2 opciones.',
      path: ['type'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'single') {
        return data.choices?.filter((c) => c.correct).length === 1;
      }
      return true;
    },
    {
      message: 'Las preguntas de opción única deben tener exactamente una respuesta correcta.',
      path: ['choices'],
    }
  );

export type Item = z.infer<typeof ItemSchema>;

export const ExamBlueprintSchema = z
  .object({
    id: z.string().optional(),
    subjectId: z.string(),
    totalItems: z
      .number()
      .int()
      .min(5, 'El examen debe tener al menos 5 preguntas.')
      .max(200, 'El examen no puede tener más de 200 preguntas.'),
    timeLimitMin: z
      .number()
      .int()
      .min(5, 'El límite de tiempo debe ser de al menos 5 minutos.')
      .max(300, 'El límite de tiempo no puede exceder los 300 minutos.'),
    topicWeights: z.array(z.object({
      topicId: z.string(),
      weight: z.number().min(0),
    })),
    cognitiveWeights: z.array(z.object({
      level: z.enum(CognitiveLevels),
      weight: z.number().min(0),
    })),
    seed: z.number().int().optional(),
  })
  .refine((data) => data.topicWeights.reduce((sum, item) => sum + item.weight, 0) > 0, {
    message: 'La suma de los pesos de los temas debe ser mayor a 0.',
    path: ['topicWeights'],
  })
  .refine((data) => data.cognitiveWeights.reduce((sum, item) => sum + item.weight, 0) > 0, {
    message: 'La suma de los pesos cognitivos debe ser mayor a 0.',
    path: ['cognitiveWeights'],
  });

export type ExamBlueprint = z.infer<typeof ExamBlueprintSchema>;
