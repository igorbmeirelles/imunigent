import { tool } from "langchain";
import { VACCINES } from "../domain/vaccines";
import * as z from "zod";

interface SearchCriteria {
  name?: string;
  age?: {
    years: number;
    compare:
      | "equal"
      | "lowerThen"
      | "greaterThen"
      | "greaterThenOrEqual"
      | "lowerThenOrEqual";
  };
}

function getVaccines(criteria: SearchCriteria) {
  const result = VACCINES.filter((vaccine) => {
    if (criteria.name && vaccine.name === criteria.name) {
      return true;
    }

    const compares = {
      equal: (base: number, comp: number) => base === comp,
      lowerThenOrEqual: (base: number, comp: number) => base <= comp,
      greaterThenOrEqual: (base: number, comp: number) => base >= comp,
      greaterThen: (base: number, comp: number) => base > comp,
      lowerThen: (base: number, comp: number) => base < comp,
    };
    if (
      criteria.age &&
      vaccine.ageRangeInYears.some((age) => {
        const result = compares[criteria.age!.compare](
          age,
          criteria.age!.years,
        );
        return result;
      })
    ) {
      return true;
    }
    return false;
  });

  return result.map((r) => JSON.stringify(r));
}

export const getVaccinesTool = tool(getVaccines, {
  name: "getVaccinesTool",
  description:
    "Fetch details about vaccines based on the desired query and the time",
  schema: z.object({
    name: z.string().optional(),
    age: z
      .object({
        years: z.number(),
        compare: z.enum([
          "equal",
          "lowerThen",
          "greaterThen",
          "greaterThenOrEqual",
          "lowerThenOrEqual",
        ]),
      })
      .optional(),
  }),
});
