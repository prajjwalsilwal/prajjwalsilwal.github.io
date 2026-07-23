import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces, JetBrains_Mono } from 'next/font/google';
import { FxProvider } from '@/world/FxProvider';
import { SmoothScroll } from '@/world/SmoothScroll';
import { Loader } from '@/components/Loader';
import { Nav } from '@/components/Nav';
import { profile } from '@/content/profile';
import './globals.css';

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords: [...profile.keywords],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    url: profile.siteUrl,
    title: `${profile.name} | ${profile.role}`,
    description: profile.ogDescription,
    siteName: profile.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} | ${profile.role}`,
    description: profile.ogDescription,
  },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#040507',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>PS</text></svg>"
        />
        <script
          type="application/ld+json"
          // Static, author-controlled JSON-LD from the content layer.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profile.jsonLd) }}
        />
      </head>
      <body>
        <FxProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {/* Lives outside the world so section tracking still works when the
              3D layer is off. */}
          <SmoothScroll />
          <Loader />
          <Nav />
          {children}
        </FxProvider>
      </body>
    </html>
  );
}
