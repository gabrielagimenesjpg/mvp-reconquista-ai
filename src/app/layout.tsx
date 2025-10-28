import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reconquista.AI - Reconquiste seu amor com Inteligência Artificial',
  description: 'Plataforma que ajuda pessoas a reconquistar ou conquistar alguém usando inteligência artificial emocional. Receba mensagens, tarefas e estratégias diárias personalizadas.',
  keywords: 'reconquista, relacionamento, inteligência artificial, amor, namoro, conquista',
  authors: [{ name: 'Reconquista.AI' }],
  openGraph: {
    title: 'Reconquista.AI - Reconquiste seu amor com IA',
    description: 'Plano personalizado de 30 dias para reconquistar seu ex ou crush usando inteligência artificial emocional.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reconquista.AI - Reconquiste seu amor com IA',
    description: 'Plano personalizado de 30 dias para reconquistar seu ex ou crush usando inteligência artificial emocional.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#E91E63" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}