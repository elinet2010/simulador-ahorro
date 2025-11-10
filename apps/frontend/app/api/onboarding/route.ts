import { NextRequest, NextResponse } from 'next/server';

/**
 * Genera un UUID simulado (formato similar a UUID v4)
 */
function generateRequestCode(): string {
  const chars = '0123456789abcdef';
  const segments = [8, 4, 4, 4, 12];
  
  return segments
    .map((length) => {
      return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    })
    .join('-');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, document, email, recaptchaToken } = body;

    // Validar campos requeridos
    if (!name || !document || !email || !recaptchaToken) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar reCAPTCHA
    if (!recaptchaToken || recaptchaToken === '') {
      return NextResponse.json(
        { error: 'Token de reCAPTCHA requerido' },
        { status: 400 }
      );
    }

    // Verificar reCAPTCHA con Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!recaptchaSecret) {
      console.warn('RECAPTCHA_SECRET_KEY no está configurado. En desarrollo, se acepta cualquier token.');
      // En desarrollo, si no hay secret key, generar código de solicitud
      const requestCode = generateRequestCode();
      return NextResponse.json({
        success: true,
        requestCode,
        message: 'Formulario enviado correctamente (modo desarrollo)',
      });
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
      { method: 'POST' }
    );

    const recaptchaData = await recaptchaResponse.json();

    // Validar que el token sea "OK"
    if (!recaptchaData.success || recaptchaData.success !== true) {
      return NextResponse.json(
        { error: 'reCAPTCHA inválido. Por favor, recarga la página e intenta nuevamente.' },
        { status: 400 }
      );
    }

    // Validar score (opcional, pero recomendado)
    if (recaptchaData.score !== undefined && recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA score bajo. Por favor, intenta nuevamente.' },
        { status: 400 }
      );
    }

    // Generar código de solicitud (UUID simulado)
    const requestCode = generateRequestCode();

    // Aquí podrías guardar los datos en una base de datos
    // Por ahora, solo retornamos el código de solicitud

    return NextResponse.json({
      success: true,
      requestCode,
      message: 'Formulario enviado correctamente',
    });
  } catch (error) {
    console.error('Error en onboarding:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


