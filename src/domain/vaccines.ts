import { z } from "zod";

export interface VaccineItem {
  name: string;
  information: string;
  ageRangeInYears: number[];
}

export interface VaccineScheduleItem extends Array<VaccineItem> {}

const VACCINES_ARRAY: VaccineItem[] = [
  {
    name: "BCG",
    information: "Proteção contra formas graves de tuberculose",
    ageRangeInYears: [0],
  },
  {
    name: "Hepatite B",
    information: "Primeira dose",
    ageRangeInYears: [0],
  },
  {
    name: "Pentavalente",
    information: "Difteria, tétano, coqueluche, hepatite B e Hib",
    ageRangeInYears: [2, 4, 6],
  },
  {
    name: "VIP",
    information: "Poliomielite inativada",
    ageRangeInYears: [2, 4, 6],
  },
  {
    name: "VOP",
    information: "Poliomielite oral",
    ageRangeInYears: [2, 4, 6, 15, 48],
  },
  {
    name: "Pneumocócica 10-valente",
    information: "Proteção contra pneumonias e otites",
    ageRangeInYears: [2, 4, 15],
  },
  {
    name: "Rotavírus",
    information: "Proteção contra diarreia grave",
    ageRangeInYears: [2, 4],
  },
  {
    name: "Triplice Viral (SCR)",
    information: "Sarampo, caxumba e rubéola",
    ageRangeInYears: [12],
  },
  {
    name: "Meningocócica C",
    information: "Reforço",
    ageRangeInYears: [12],
  },
  {
    name: "Febre Amarela",
    information: "Dose única ou conforme calendário local",
    ageRangeInYears: [12, 180],
  },
  {
    name: "DTPa",
    information: "Tríplice bacteriana acelular",
    ageRangeInYears: [15, 48, 180],
  },
  {
    name: "Hepatite A",
    information: "Dose única conforme calendário",
    ageRangeInYears: [15],
  },
  {
    name: "HPV",
    information: "Vacina contra papilomavírus humano",
    ageRangeInYears: [108],
  },
  {
    name: "Influenza",
    information: "Anual para grupo de risco ou conforme calendário",
    ageRangeInYears: [180],
  },
];

const VaccineSchema = z.object({
  name: z.string(),
  information: z.string(),
  ageRangeInYears: z.array(z.number()),
});

export const VACCINES_SCHEMA = z.array(VaccineSchema);

export type VaccineSchedule = z.infer<typeof VACCINES_SCHEMA>;

export const VACCINES = VACCINES_SCHEMA.parse(VACCINES_ARRAY);
