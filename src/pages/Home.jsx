import Hero from '../components/Hero';
import WorksShowcase from '../components/WorksShowcase';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import CtaSection from '../components/CtaSection';
import InquiryForm from '../components/InquiryForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <WorksShowcase />
      <AboutSection />
      <ServicesSection />
      <CtaSection />
      <InquiryForm />
      <Footer />
    </>
  );
}
