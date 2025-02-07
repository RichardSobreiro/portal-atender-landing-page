interface UpdatePatientProps {
  patientId: string;
}

const UpdatePatient: React.FC<UpdatePatientProps> = ({ patientId }) => {
  return <h1>EDITAR PACIENTE: {patientId}</h1>;
};

export default UpdatePatient;
