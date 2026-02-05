import { Metadata } from 'next';
import ContactUsContent from '@/components/ContactUs/ContactUsContent';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us for any questions or assistance.',
};

export default function ContactUsPage() {
  return <ContactUsContent />;
}