import {
  Leaf, Globe, Zap, BarChart2, Shield, Database,
  AlertCircle, BookOpen, CheckCircle
} from 'lucide-react'

const TECH = [
  { name: 'React + Vite',       desc: 'Modern frontend framework and blazing-fast dev server',         color: 'text-blue-600',   bg: 'bg-blue-50' },
  { name: 'Tailwind CSS',       desc: 'Utility-first CSS for rapid, consistent styling',               color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  { name: 'Recharts',           desc: 'Declarative charting for data visualisation',                    color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Python Flask',       desc: 'Lightweight WSGI web framework for the REST API',               color: 'text-green-600',  bg: 'bg-green-50' },
  { name: 'BeautifulSoup4',     desc: 'HTML parsing to count page resources',                          color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'SQLite + SQLAlchemy', desc: 'Embedded relational database with Python ORM',                color: 'text-red-600',    bg: 'bg-red-50' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg mb-6">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About GreenWeb</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg">
          An academic project exploring Sustainable Computing and Green Web Development —
          helping users understand and reduce the environmental impact of websites.
        </p>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl px-6 py-4 mb-12 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-800 text-sm leading-relaxed">
          <strong>Educational Tool Disclaimer:</strong> GreenWeb is an estimation tool for academic purposes.
          Results are heuristic estimates — not certified carbon measurements, not suitable for
          regulatory reporting, and not endorsed by any official standards body.
        </p>
      </div>

      {/* What are website carbon emissions */}
      <section className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-emerald-600" />
          What Are Website Carbon Emissions?
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-3 text-sm leading-relaxed">
          <p>
            Every time someone visits a webpage, data is transferred across networks, processed by servers,
            and rendered on a device. Each step consumes electricity, which — depending on the energy mix
            of the grid powering these systems — results in carbon dioxide equivalent (CO₂e) emissions.
          </p>
          <p>
            While a single page view may seem trivial, at internet scale these emissions are significant.
            The internet sector is estimated to contribute a notable share of global greenhouse gas emissions,
            comparable to the aviation industry (though exact figures vary widely across studies and methodologies).
          </p>
          <p>
            The main contributors to a webpage's carbon footprint include: data transfer volume,
            server energy efficiency, CDN energy sourcing, end-user device energy, and network
            infrastructure efficiency.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Why Sustainable Web Development Matters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Reducing Data Transfer', 'Smaller pages use less bandwidth, requiring less energy at every step in the delivery chain.'],
            ['Green Hosting', 'Hosting on servers powered by renewable energy can drastically cut carbon intensity per request.'],
            ['Efficient Code', 'Leaner JavaScript and CSS means less processing time on both server and client devices.'],
            ['Image Optimisation', 'Images are often 60-80% of page weight — optimising them has the biggest single impact.'],
          ].map(([title, desc]) => (
            <div key={title} className="card !p-5">
              <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How GreenWeb works */}
      <section className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-emerald-600" />
          How GreenWeb Works
        </h2>
        <div className="card">
          <ol className="space-y-4 text-sm text-gray-600">
            {[
              ['URL Validation + SSRF Protection', 'Input is validated and DNS-resolved to block access to private, loopback, or link-local IP ranges.'],
              ['SSRF-Safe HTTP Fetch', 'The Flask backend fetches only the HTML document with redirect validation to prevent server-side request forgery.'],
              ['HTML Parsing', 'BeautifulSoup4 counts <img>, <script>, and <link> tags, and external domain references.'],
              ['Transfer Size Estimation', 'Since a simple HTTP fetch does not download sub-resources, we estimate total transfer size using configurable average file sizes per resource type.'],
              ['Energy Calculation', 'Energy (kWh) = Transfer (GB) × Energy Intensity (kWh/GB). Default: 0.05 kWh/GB (illustrative).'],
              ['Carbon Calculation', 'Carbon (gCO₂e) = Energy (kWh) × Grid Carbon Intensity (gCO₂e/kWh). Default: 400 gCO₂e/kWh (illustrative).'],
              ['Scoring', 'A heuristic score (0–100) penalises high carbon emissions, large HTML, many scripts, many images, and slow response times.'],
              ['Recommendations', 'Threshold-based rules generate tailored recommendations — not identical generic advice for every site.'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-800">{title}</p>
                  <p className="text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-600" />
          Technologies Used
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH.map(t => (
            <div key={t.name} className="card !p-4">
              <div className={`text-xs font-bold ${t.color} ${t.bg} px-2 py-1 rounded-lg inline-block mb-2`}>{t.name}</div>
              <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          Limitations
        </h2>
        <div className="card bg-gray-50">
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'A simple HTTP fetch does not download all browser-rendered resources. Sub-resource sizes are estimated using heuristic averages.',
              'JavaScript-injected content (lazy loading, SPAs) may not be captured.',
              'The carbon model uses illustrative defaults and does not account for renewable energy mix of specific hosts.',
              'Network-level energy (routers, ISP infrastructure) is approximated, not measured.',
              'The environmental score is a project-defined heuristic and carries no industry certification.',
              'Results should not be used for regulatory reporting, ESG disclosures, or marketing claims.',
            ].map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow-500 flex-shrink-0">⚠</span> {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Project info */}
      <div className="text-center text-xs text-gray-400">
        GreenWeb · Academic Project · Sustainable Computing & Green Computing<br />
        Built with React, Vite, Tailwind CSS, Python Flask, SQLite
      </div>
    </div>
  )
}
