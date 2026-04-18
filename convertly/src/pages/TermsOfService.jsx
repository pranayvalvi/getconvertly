import SEO from "../components/SEO";

export default function TermsOfService() {
  return (
    <>
      <SEO 
        title="Terms of Service"
        description="Convertly Terms of Service. Understand the rules and conditions for using our free platform."
        url="/terms-of-service"
      />
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
          <p className="text-lg">
            Welcome to Convertly. By accessing or using our free platform and tools, you agree to be bound by the following Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing Convertly, you accept these terms and conditions in full. Do not continue to use Convertly's website if you do not accept all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Appropriate Usage</h2>
          <p>
            Convertly provides a free web service designed to help users convert, merge, compress, and analyze files and data. You agree that you will not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Upload maliciously infected files designed to damage underlying server architecture (e.g., viruses, malware).</li>
            <li>Use the tools to process or generate illegal, illicit, or heavily restricted materials.</li>
            <li>Utilize automated server scripts, scrapers, or bots to flood the website APIs and deny service to other users (DDoS).</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Limitation of Liability</h2>
          <p>
            Our tools are provided entirely "<strong>AS IS</strong>" and without warranty of any kind. 
          </p>
          <p>
            Because we do not store file backups for privacy reasons, Convertly and its developers are absolutely not responsible or liable for any loss of data, file corruption, or business interruption caused directly or indirectly from utilizing our tools. You should always possess a local backup of your files before processing them through Convertly.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            You retain 100% of all intellectual property rights to the files you upload and the content you convert. Convertly claims no ownership over user-uploaded content. 
            Conversely, the source code, design, logos, and specific application architecture belonging to Convertly remain the intellectual property of the developers.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Revisions and Modifications</h2>
          <p>
            We reserve the right to revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
          
          <p className="text-sm mt-12 text-slate-400">
            Last Updated: 2024
          </p>
        </div>
      </div>
    </>
  );
}
