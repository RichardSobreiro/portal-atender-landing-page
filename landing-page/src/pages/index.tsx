/** @format */

import { useRef } from 'react';
import Header from '../components/Header/Header';
import styles from '../styles/Home.module.css';
import { FaMobileAlt, FaDesktop, FaCheckCircle } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Footer from '@/components/Footer/Footer';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import PhoneInput from 'react-phone-number-input'; // Import react-phone-number-input
import 'react-phone-number-input/style.css'; // Import CSS for the phone input style

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: Yup.string(),
  message: Yup.string().required('Mensagem é obrigatória'),
});

// Switch from getServerSideProps to getStaticProps
export const getStaticProps = async () => {
  const title = 'Portal Atender';
  const description =
    'O Melhor Sistema para Clínicas de Estética, Odontologia e Medicina em geral com gestão do seu Whatsapp Business.';

  return {
    props: {
      title,
      description,
    },
  };
};

export default function Home({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const testeGratisSection = useRef<HTMLDivElement | null>(null);
  const planosSection = useRef<HTMLDivElement | null>(null);
  const contatoSection = useRef<HTMLDivElement | null>(null);

  const scrollToTesteGratis = () => {
    if (testeGratisSection.current) {
      window.scrollTo({
        top: testeGratisSection.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const scrollToPlanos = () => {
    if (planosSection.current) {
      window.scrollTo({
        top: planosSection.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const scrollToContato = () => {
    if (contatoSection.current) {
      window.scrollTo({
        top: contatoSection.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    try {
      const response = await fetch(
        'https://ol0wnbyn64.execute-api.sa-east-1.amazonaws.com/prod/landing-page-contact-form-send-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        toast.success('Mensagem enviada com sucesso!', {
          position: 'top-center', // Correct way to set position
        });
        resetForm(); // Clear the form fields after successful submission
      } else {
        toast.error('Ocorreu um erro ao enviar a mensagem.', {
          position: 'top-center', // Correct way to set position
        });
      }
    } catch (error) {
      toast.error('Erro ao enviar a mensagem. Tente novamente.', {
        position: 'top-center', // Correct way to set position
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header
        scrollToTesteGratis={scrollToTesteGratis}
        scrollToPlanos={scrollToPlanos}
        scrollToContato={scrollToContato}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>{title}</h1>
          <p>{description}</p>
          <button className={styles.ctaButton} onClick={scrollToTesteGratis}>
            Testar Grátis
          </button>
        </div>

        <div className={styles.heroIcons}>
          <FaMobileAlt className={styles.icon} />
          <FaDesktop className={styles.icon} />
        </div>
      </section>

      {/* Teste Grátis Section */}
      <section
        id="teste-gratis"
        className={styles.testSection}
        ref={testeGratisSection}
      >
        <h2>
          Teste Grátis Por 14 dias com gestão do Whatsapp Business incluso
        </h2>
        <h2>Em Breve</h2>
      </section>

      {/* Planos Section */}
      <section id="planos" className={styles.planosSection} ref={planosSection}>
        <div className={styles.planosContent}>
          <h2>Plano Único por R$ 49,90</h2>
          <ul className={styles.featuresList}>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Pacientes
              ilimitados
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Modelos de anamnese
              ilimitados
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Anamneses
              customizadas
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Integração com
              Whatsapp Business
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Gerenciamento de
              campanhas no Whatsapp
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Envio de mensagens
              no Whatsapp para pacientes
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Registros
              ilimitados
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Acesso no celular
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Impressão de
              documentos personalizados
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> 20 Profissionais
              com agenda individual
            </li>
          </ul>
          <button className={styles.ctaButton} onClick={scrollToTesteGratis}>
            Testar Grátis 7 Dias
          </button>
        </div>
      </section>

      {/* Contato Section */}
      <section
        id="contato"
        className={styles.contatoSection}
        ref={contatoSection}
      >
        <h2>Contato</h2>
        <Formik
          initialValues={{ name: '', email: '', phone: '', message: '' }}
          validationSchema={contactSchema}
          onSubmit={handleFormSubmit}
        >
          <Form className={styles.contactForm}>
            <div className={styles.contactFormRow}>
              <div>
                <label htmlFor="name">Nome</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div>
                <label htmlFor="phone">Telefone</label>
                <PhoneInput
                  international
                  defaultCountry="BR" // Set Brazil as the default country
                  id="phone"
                  name="phone"
                  value={''} // Use the Formik value here
                  onChange={(value: string | undefined) => {
                    // Ensure the value is a string before updating Formik
                    const formikField = document.getElementById('phone') as any;
                    formikField.value = value ? String(value) : '';
                  }}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message">Mensagem</label>
              <Field as="textarea" id="message" name="message" />
              <ErrorMessage
                name="message"
                component="div"
                className={styles.error}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Enviar Mensagem
            </button>
          </Form>
        </Formik>
      </section>

      <Footer />

      {/* ToastContainer for the toast notifications */}
      <ToastContainer />
    </div>
  );
}
