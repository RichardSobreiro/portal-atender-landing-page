/** @format */
import React, { useEffect, useState } from 'react';
import PatientHeader from './PatientHeader';
import styles from './VisualizePatient.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faClock,
  faImage,
  faDollarSign,
  faRuler, // New icon for 'Medidas'
  faFolder,
  faFileMedical, // New icon for 'Atestados'
} from '@fortawesome/free-solid-svg-icons';
import PatientRecordWrapper from './patient-records/PatientRecordWrapper';
import { useSpinner } from '@/context/SpinnerContext';
import axiosInstance from '@/services/axiosInstance';
import { PatientDto } from '@/dtos/Patients/PatientDto';
import { toast, ToastContainer } from 'react-toastify';
import PatientGallery from './gallery/PatientGallery';

interface VisualizePatientProps {
  patientId: string;
}

const VisualizePatient: React.FC<VisualizePatientProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { showSpinner, hideSpinner, isLoading } = useSpinner();
  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [patientName, setPatientName] = useState<string>('Carregando...');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      showSpinner();
      try {
        const response = await axiosInstance.get(`/patients/${patientId}`);
        setPatient(response.data);
        setPatientName(response.data.name);
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        toast.error('Erro ao carregar os dados do paciente.');
        setPatientName('Erro ao carregar');
      } finally {
        hideSpinner();
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the available tabs (only 7)
  const tabs = [
    {
      id: 'summary',
      label: 'Prontuário',
      icon: faAddressCard,
      component: <PatientRecordWrapper patient={patient} appointments={[]} />,
    },
    {
      id: 'appointments',
      label: 'Agendamentos',
      icon: faClock,
      component: <div>Atendimentos</div>,
    },
    {
      id: 'gallery',
      label: 'Galeria',
      icon: faImage,
      component: <PatientGallery patientId={patientId} />,
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: faDollarSign,
      component: <div>Financeiro</div>,
    },
    {
      id: 'measures',
      label: 'Medidas',
      icon: faRuler,
      component: <div>Medidas</div>,
    },
    {
      id: 'files',
      label: 'Arquivos',
      icon: faFolder,
      component: <div>Arquivos</div>,
    },
    {
      id: 'certificates',
      label: 'Atestados',
      icon: faFileMedical,
      component: <div>Atestados</div>,
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className={styles.container}>
        {/* Patient Header */}
        <PatientHeader name={patientName} patientId={patientId} />

        {/* Tabs Navigation */}
        <div className={`${styles.tabs} ${isMobile ? styles.mobileTabs : ''}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className={styles.tabIcon} />
              {!isMobile && (
                <span className={styles.tabLabel}>{tab.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* Render the active tab component */}
        <div className={styles.tabContent}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </>
  );
};

export default VisualizePatient;
