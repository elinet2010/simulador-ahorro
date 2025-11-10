'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitOnboarding, resetOnboarding } from '@/store/slices/onboardingSlice';
import { onboardingSchema } from '@/lib/validations-onboarding';
import ReCaptcha from '../ReCaptcha/ReCaptcha';

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

// Validar que el site key esté configurado (modo desarrollo permite simulación)
if (typeof window !== 'undefined' && !RECAPTCHA_SITE_KEY) {
  console.warn(
    '⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está configurado. Usando modo desarrollo con token simulado.'
  );
}

interface OnboardingFormValues {
  name: string;
  document: string;
  email: string;
  recaptchaToken: string;
}

export default function OnboardingForm() {
  const dispatch = useAppDispatch();
  const { loading, success, error, requestCode } = useAppSelector(
    (state) => state.onboarding
  );
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  // Resetear el estado al montar el componente
  useEffect(() => {
    dispatch(resetOnboarding());
  }, [dispatch]);

  const initialValues: OnboardingFormValues = {
    name: '',
    document: '',
    email: '',
    recaptchaToken: recaptchaToken || '',
  };

  const handleSubmit = async (values: OnboardingFormValues) => {
    // Validar que reCAPTCHA tenga token
    if (!recaptchaToken) {
      setRecaptchaError('reCAPTCHA no está cargado. Por favor, recarga la página.');
      return;
    }

    setRecaptchaError(null);

    // Enviar formulario con el token de reCAPTCHA
    dispatch(
      submitOnboarding({
        ...values,
        recaptchaToken,
      })
    );
  };

  // Si hay éxito, mostrar mensaje con código
  if (success && requestCode) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon
            sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom color="success.main">
            ¡Formulario enviado exitosamente!
          </Typography>
          <Card sx={{ mt: 3, backgroundColor: 'grey.50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tu código de solicitud es:
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mt: 1,
                }}
              >
                {requestCode}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Guarda este código para futuras consultas.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Formulario de Onboarding
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Completa tus datos para continuar
      </Typography>

      {/* Error de reCAPTCHA */}
      {recaptchaError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {recaptchaError}
        </Alert>
      )}

      {/* Error del servidor */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={onboardingSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid item xs={12} sm={6} {...({} as any)}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Nombre completo"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  required
                />
              </Grid>

              {/* Documento */}
              <Grid item xs={12} {...({} as any)}>
                <Field
                  as={TextField}
                  fullWidth
                  name="document"
                  label="Documento de identidad"
                  error={touched.document && !!errors.document}
                  helperText={touched.document && errors.document}
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} {...({} as any)}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  required
                />
              </Grid>

              {/* reCAPTCHA (oculto) */}
              <Grid item xs={12} {...({} as any)} >
                <ReCaptcha
                  siteKey={RECAPTCHA_SITE_KEY}
                  onTokenChange={(token) => {
                    setRecaptchaToken(token);
                    setFieldValue('recaptchaToken', token || '');
                    if (token) {
                      setRecaptchaError(null);
                    }
                  }}
                  onError={(error) => {
                    setRecaptchaError(error);
                  }}
                />
                {recaptchaToken === null && !recaptchaError && (
                  <Typography variant="caption" color="text.secondary">
                    {RECAPTCHA_SITE_KEY 
                      ? 'Cargando reCAPTCHA...' 
                      : 'Inicializando reCAPTCHA (modo desarrollo)...'}
                  </Typography>
                )}
                {touched.recaptchaToken && errors.recaptchaToken && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.recaptchaToken}
                  </Typography>
                )}
              </Grid>

              {/* Botón enviar */}
              <Grid item xs={12} {...({} as any)}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading || !recaptchaToken}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Enviando...' : 'Enviar Formulario'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

