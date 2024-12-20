import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class User {
  id!: string;
  email!: string;
  password!: string;
  targets!: Array<string>;
}

export type UserLogin = Pick<User, "email" | "password">;

export type TypeUserLoginForm = TypedNonNullableFormControls<UserLogin>;

export type TypedNonNullableFormControls<T> = {
    [K in keyof T]: T[K] extends Array<infer R>
      ? FormArray<
          R extends Record<string | number | symbol, unknown>
            ? FormGroup<TypedFormControls<R>>
            : FormControl<R>
        >
      : T[K] extends Record<string | number | symbol, unknown>
      ? FormGroup<TypedFormControls<T[K]>>
      : FormControl<T[K]>;
  };

  export type TypedFormControls<T> = {
    [K in keyof T]-?: T[K] extends Array<infer R>
      ? FormArray<
          R extends Record<string | number | symbol, unknown>
            ? FormGroup<TypedFormControls<R>>
            : FormControl<R>
        >
      : T[K] extends Record<string | number | symbol, unknown>
      ? FormGroup<TypedFormControls<T[K]>>
      : FormControl<T[K]>;
  };
