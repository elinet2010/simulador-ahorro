import { Box, Typography, Container } from '@mui/material';
import OnboardingForm from '@/components/onboarding/OnboardingForm/OnboardingForm';

export default function OnboardingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
      <Box sx={{mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4"  color="text.tertiary" component="h1" gutterBottom>
          Solicitud de Información
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Completa el siguiente formulario para recibir atencion personalizada.
        </Typography>
      </Box>
      <OnboardingForm />
    </Container>
  );
}


