import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        {/* Meta tags for SEO */}
        <title>
          Portal Atender - O Melhor Sistema para Clínicas e Consultórios
        </title>
        <meta
          name="description"
          content="Portal Atender - Sistema de Gestão para Clínicas de Estética, Odontologia e Medicina."
        />
        <meta
          name="keywords"
          content="Portal Atender, Sistema de Gestão, Clínicas de Estética, Odontologia, Medicina, Agendamento Online, WhatsApp Business"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Portal Atender - Sistema de Gestão para Clínicas"
        />
        <meta
          property="og:description"
          content="Portal Atender é a solução completa para gestão de clínicas de estética, odontologia e medicina."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portalatender.com.br" />
        <meta property="og:image" content="/logo.png" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
