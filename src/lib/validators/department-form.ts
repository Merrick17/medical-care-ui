import * as z from "zod";

export const departmentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>; 