/**
 * Pruebas unitarias para el hook useDebounce
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('debe retornar el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('test', 300));
    expect(result.current).toBe('test');
  });

  it('debe actualizar el valor después del delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    expect(result.current).toBe('initial');

    // Cambiar el valor
    rerender({ value: 'updated', delay: 300 });

    // El valor aún debe ser el inicial
    expect(result.current).toBe('initial');

    // Avanzar el tiempo
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Ahora debe ser el valor actualizado
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('debe cancelar el debounce anterior si el valor cambia antes del delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 300 },
      }
    );

    expect(result.current).toBe('first');

    // Cambiar a segundo valor
    rerender({ value: 'second', delay: 300 });
    
    // Avanzar solo 200ms (antes del delay)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // El valor aún debe ser el primero
    expect(result.current).toBe('first');

    // Cambiar a tercer valor antes de que termine el delay
    rerender({ value: 'third', delay: 300 });

    // Avanzar el tiempo restante
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Debe ser el tercer valor, no el segundo
    await waitFor(() => {
      expect(result.current).toBe('third');
    });
  });

  it('debe usar el delay por defecto de 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'test' },
      }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('debe funcionar con diferentes tipos de valores', () => {
    const { result: resultNumber, rerender: rerenderNumber } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 0 },
      }
    );

    expect(resultNumber.current).toBe(0);

    rerenderNumber({ value: 100 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(resultNumber.current).toBe(100);
  });

  it('debe funcionar con objetos', () => {
    const initialObj = { name: 'test', value: 1 };
    const updatedObj = { name: 'updated', value: 2 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: initialObj },
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });
});

