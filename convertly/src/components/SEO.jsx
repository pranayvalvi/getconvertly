import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, keywords, url }) {
  const siteName = "Convertly";
  const baseUrl = "https://getconvertly.in";
  const fullUrl = `${baseUrl}${url || ""}`;
  const image = `${baseUrl}/favicon-192.png`;
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={fullUrl} />

      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
