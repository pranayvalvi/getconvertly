import SEO from "../components/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Convertly Privacy Policy. Learn how we securely process your files completely ephemerally."
        url="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
          <p className="text-lg">
            At Convertly, your privacy and data security are our highest priority. We explicitly designed our platform architecture to never hold onto your data. 
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. How We Handle Your Files</h2>
          <p>
            When you use our Image or PDF tools, your files are uploaded to our secure processing servers. 
            <strong> We do not store your files.</strong> The moment your conversion or compression is complete, the original file and the output file are completely, permanently deleted from our servers. 
          </p>
          <p>
            We do not maintain databases of user files, we do not view your files, and we do not share your files with third parties.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Client-Side Processing (Developer Tools)</h2>
          <p>
            Tools like our JSON Formatter, Base64 Encoder, and Password Generator operate 100% locally on your device inside your web browser. Any text or data you type into these developer tools never leaves your computer and is never sent to our servers.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Cookies and Advertising (AdSense)</h2>
          <p>
            To keep Convertly completely free for everyone to use, we monetize the platform using Google AdSense. 
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Third party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our web site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Google Ads Settings</a>.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Log Files and Analytics</h2>
          <p>
            Like almost all websites, we may utilize standard server log files to monitor the health of our application and prevent malicious DDoS attacks. These logs may include internet protocol (IP) addresses, browser type, and timestamps. This information is purely used for server administration and is completely anonymous.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding our privacy practices, you can contact the administration team.
          </p>
          
          <p className="text-sm mt-12 text-slate-400">
            Last Updated: 2024
          </p>
        </div>
      </div>
    </>
  );
}
