import './globals.css';

export const metadata = {
  title: 'Fieldwork — Citizen Science News',
  description: 'Discoveries, projects, and people powering citizen science — transparently labelled so you always know what you\'re reading.',
  openGraph: {
    title: 'Fieldwork — Citizen Science News',
    description: 'Science by everyone, for everyone. Every story transparently labelled.',
    siteName: 'Fieldwork',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fieldwork — Citizen Science News',
    description: 'Science by everyone, for everyone.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
