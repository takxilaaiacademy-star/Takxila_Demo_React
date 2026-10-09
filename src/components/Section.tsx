import type { ReactNode } from 'react';
import { Box, Container, Typography, type ContainerProps } from '@mui/material';
import type { ResponsiveStyleValue } from '@mui/system';

interface HeadingProps {
  kick?: string;
  title: ReactNode;
  hl?: string;
  after?: string;
  sub?: string;
  align?: 'left' | 'center';
  mb?: number;
}

// Kicker + big two-tone heading used at the top of most sections.
export function Heading({ kick, title, hl, after, sub, align = 'left', mb = 4 }: HeadingProps) {
  return (
    <Box sx={{ textAlign: align, mb }}>
      {kick && (
        <Typography variant="overline" component="div" color="text.secondary">
          {kick}
        </Typography>
      )}
      <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 46 }, my: 0.75 }}>
        {title}{' '}
        {hl && (
          <Box component="span" sx={{ color: 'secondary.main' }}>
            {hl}
          </Box>
        )}
        {after ? ' ' + after : ''}
      </Typography>
      {sub && (
        <Typography color="text.secondary" sx={{ maxWidth: 640, mx: align === 'center' ? 'auto' : 0, fontSize: 17 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

interface PageProps {
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
  py?: ResponsiveStyleValue<number>;
}

export function Page({ children, maxWidth = 'lg', py = { xs: 4, md: 7 } }: PageProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ py, position: 'relative', zIndex: 1, animation: 'txrise .6s cubic-bezier(.2,.8,.2,1) both' }}>
      {children}
    </Container>
  );
}
