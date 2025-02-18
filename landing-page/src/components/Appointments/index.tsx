/** @format */

import React from 'react';
import withAuth from '@/components/HoC/WithAuth';

const Appointments: React.FC = () => {
  return <h1>Atendimentos CRUD</h1>;
};

export default withAuth(Appointments);
