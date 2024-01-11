import { SelectOption } from '../types';
import * as React from 'react';
import Select from 'react-select'

interface Props {
  onChange: (value: any) => void;
  value?: SelectOption;
  options: readonly SelectOption[];
  placeholder?: string;
  name?: string;
}

export const MatchColumnSelect = ({ onChange, value, options, placeholder, name }: Props) => {
  // const styles = useStyleConfig("MatchColumnsStep") as Styles
  return (
      <Select options={options} value={value} placeholder={placeholder} onChange={onChange}/>
  );
};
