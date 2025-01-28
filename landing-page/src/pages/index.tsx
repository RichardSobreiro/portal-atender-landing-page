/** @format */

import { useRef } from 'react';
import Header from '../components/Header/Header';
import styles from '../styles/Home.module.css';
import { FaMobileAlt, FaDesktop, FaCheckCircle } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
  message: Yup.string().required('Mensagem é obrigatória'),
});

export default function Home() {
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

  const handleFormSubmit = async (values: any) => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      alert('Mensagem enviada com sucesso!');
    } else {
      alert('Ocorreu um erro ao enviar a mensagem.');
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
          <h1>
            O Melhor Sistema para Clínicas de Estética, Odontologia e Medicina
            em geral.
          </h1>
          <p>Veja tudo que o Portal Atender faz por você!</p>
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
        <h2>Em breve</h2>
      </section>

      {/* Planos Section */}
      <section id="planos" className={styles.planosSection} ref={planosSection}>
        <div className={styles.planosContent}>
          <h1>Plano Único por R$ 49,90</h1>
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
        <h1>Contato</h1>
        <Formik
          initialValues={{ name: '', email: '', phone: '', message: '' }}
          validationSchema={contactSchema}
          onSubmit={handleFormSubmit}
        >
          <Form className={styles.contactForm}>
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
              <Field type="text" id="phone" name="phone" />
              <ErrorMessage
                name="phone"
                component="div"
                className={styles.error}
              />
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
    </div>
  );
}
