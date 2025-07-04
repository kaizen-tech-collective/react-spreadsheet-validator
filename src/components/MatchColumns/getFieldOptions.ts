import { Fields } from '../../types';

export const getFieldOptions = <T extends string>(fields: Fields<T>, fieldKey: string) => {
  const field = fields.find(({ key }) => {
    return fieldKey === key;
  })!;
  return field.fieldType.type === 'select' ? field.fieldType.options : [];
};
