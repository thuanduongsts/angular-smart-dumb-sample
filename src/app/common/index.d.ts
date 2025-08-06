type ID = string | number;
type Nil = undefined | null;
type Nillable<T> = T | undefined | null;
type Nullable<T> = T | null;
type Maybe<T> = T | undefined;
type StrOrNum = string | number;
type StrOrBool = string | boolean;
type NumOrBool = number | boolean;
type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends (infer U)[]
      ? FormControl<Array<U>>
      : FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
