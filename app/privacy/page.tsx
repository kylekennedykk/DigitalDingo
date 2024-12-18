import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Digital Dingo',
  description: 'Privacy policy and data protection information for Digital Dingo services and website.',
}

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      <div className="relative container max-w-4xl mx-auto pt-32 pb-16 px-4">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none prose-headings:text-2xl prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4">
          <section className="mb-8">
            <p className="text-neutral-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <h2>1. Introduction</h2>
            <p>
              DigitalDingo (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and protect your personal information when you use our website 
              (digitaldingo.uk) and services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>Contact information (name, email address, phone number)</li>
              <li>Business information (company name, job title)</li>
              <li>Technical data (IP address, browser type, device information)</li>
              <li>Usage data (how you interact with our website)</li>
              <li>Communication preferences</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Communicate with you about our services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Analyze and improve our website performance</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>

            <h2>5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience on our website. 
              You can control cookies through your browser settings.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>7. Contact Us</h2>
            <p>
              For any questions about this privacy policy or our data practices, please contact us at:
              <br />
              Email: hello@digitaldingo.uk
              <br />
              Phone: +44 7954 757 626
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
              privacy policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 