/** @format */

import React from 'react';
import withAuth from '@/components/HoC/WithAuth';

const Dashboard: React.FC = () => {
  return <h1>Bem-vindo ao Painel</h1>;
};

export default withAuth(Dashboard);
