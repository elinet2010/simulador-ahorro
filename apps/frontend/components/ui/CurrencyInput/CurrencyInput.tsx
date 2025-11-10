'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { parseCurrency, formatCurrencyNumber } from '@/lib/currency';

interface CurrencyInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export default function CurrencyInput({
  value,
  onChange,
  ...textFieldProps
}: CurrencyInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  const displayValue = value > 0 ? formatCurrencyNumber(value) : '';

  return (
    <TextField
      {...textFieldProps}
      value={displayValue}
      onChange={handleChange}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*',
      }}
    />
  );
}


