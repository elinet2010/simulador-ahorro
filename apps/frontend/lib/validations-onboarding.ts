import * as Yup from 'yup';

/**
 * Esquema de validación para el formulario de onboarding
 */
export const onboardingSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo debe contener letras y espacios'
    )
    .required('El nombre es requerido'),
  document: Yup.string()
    .matches(/^\d+$/, 'El documento solo debe contener números')
    .min(5, 'El documento debe tener al menos 5 dígitos')
    .max(20, 'El documento no puede tener más de 20 dígitos')
    .required('El documento es requerido'),
  email: Yup.string()
    .email('Ingrese un email válido')
    .required('El email es requerido'),
  recaptchaToken: Yup.string()
    .required('reCAPTCHA es requerido')
    .test('recaptcha-valid', 'reCAPTCHA inválido', (value) => {
      // Validación básica - el token debe existir y no estar vacío
      return value !== null && value !== undefined && value.length > 0;
    }),
});


