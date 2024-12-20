export default function PrivacyPolicy() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl md:text-5xl mb-12">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-neutral-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Introduction</h2>
            <p>
              DigitalDingo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and protect your personal information when you use our website 
              (digitaldingo.uk) and services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Business information (company name, job title)</li>
              <li>Technical data (IP address, browser type, device information)</li>
              <li>Usage data (how you interact with our website)</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you about our services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Analyze and improve our website performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience on our website. 
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Contact Us</h2>
            <p>
              For any questions about this privacy policy or our data practices, please contact us at:{' '}
              <a href="mailto:hello@digitaldingo.uk" className="text-primary-ochre hover:underline">
                hello@digitaldingo.uk
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-heading mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
              privacy policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 