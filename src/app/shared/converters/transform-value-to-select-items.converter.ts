import { SelectItemModel } from '@ui';

export function transformValueToSelectItems(values: StrOrNum[]): SelectItemModel[] {
  return values.map<SelectItemModel>(value => ({ id: value, name: value.toString() }));
}
