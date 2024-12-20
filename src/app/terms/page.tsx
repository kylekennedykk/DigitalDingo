import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Digital Dingo',
  description: 'Terms and conditions for using Digital Dingo services and website.',
}

export default function TermsPage() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      <div className="relative container max-w-4xl mx-auto pt-32 pb-16 px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none prose-headings:text-2xl prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4">
          <section className="mb-8">
            <p className="text-neutral-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using Digital Dingo&apos;s website and services, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access our services.
            </p>

            <h2>2. Services</h2>
            <p>
              Digital Dingo provides web design, development, and digital solutions. The specific deliverables, timelines, 
              and terms for each project will be outlined in individual service agreements or contracts.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              Upon full payment, clients receive ownership rights to the final deliverables created specifically for their 
              project. Digital Dingo retains ownership of any pre-existing materials, frameworks, or tools used in the 
              development process.
            </p>

            <h2>4. Client Responsibilities</h2>
            <p>
              Clients agree to provide necessary materials, feedback, and approvals in a timely manner to ensure project 
              completion. Delays in providing required materials may affect project timelines.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Payment terms, including deposits, milestone payments, and final payments, will be specified in individual 
              project agreements. Late payments may incur additional fees and affect project timelines.
            </p>

            <h2>6. Website Usage</h2>
            <p>
              Users agree not to misuse our website or attempt to gain unauthorized access to our systems. We reserve the 
              right to terminate access for users who violate these terms.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              We handle personal data in accordance with our Privacy Policy and applicable data protection laws. By using 
              our services, you consent to our data practices as described in our Privacy Policy.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              Digital Dingo shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of our services.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via 
              email or through our website.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For any questions regarding these terms, please contact us at:
              <br />
              Email: hello@digitaldingo.uk
              <br />
              Phone: +44 7954 757 626
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 