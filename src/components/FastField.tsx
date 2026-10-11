import { forwardRef, memo, startTransition, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

/**
 * A TextField that always keeps up with the keyboard.
 *
 * The field shows what was typed straight away from its own state, and tells the page about the change
 * as a low-priority React transition. So a big page (a long form, a course list that filters as you type)
 * re-renders in the background instead of making every key press wait for it.
 * Use it exactly like TextField, with `value` and `onChange`.
 */
const FastField = forwardRef<HTMLDivElement, TextFieldProps>(function FastField({ value, onChange, ...rest }, ref) {
  const [local, setLocal] = useState(value ?? '');
  /** Values this field has handed to the page that the page may not have shown yet */
  const sent = useRef(new Set<unknown>());
  const last = useRef<unknown>(value);

  // After each commit: if the page changed the value itself (a reset after sending, a prefill), show that.
  // Older values this field sent are skipped, because the page may still be catching up on them.
  useLayoutEffect(() => {
    if (value === last.current) sent.current.clear();
    else if (!sent.current.has(value)) {
      sent.current.clear();
      last.current = value;
      setLocal(value ?? '');
    }
  }, [value]);

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocal(e.target.value);
    sent.current.add(e.target.value);
    last.current = e.target.value;
    startTransition(() => onChange?.(e));
  };

  return <TextField ref={ref} {...rest} value={local} onChange={change} />;
});

export default memo(FastField);
