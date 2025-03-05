/** @format */

import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CreateAnamnesisModel from '@/components/Anamnesis/AnamnesisModel/CreateAnamnesisModel';

const ModelosAnamneses: NextPage = () => {
  return (
    <>
      <Head>
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
        <link rel="canonical" href="https://portalatender.com.br/"></link>
        <meta name="language" content="pt-BR" />
      </Head>
      <Layout renderSideMenu={true}>
        <CreateAnamnesisModel />
      </Layout>
    </>
  );
};

export default ModelosAnamneses;
