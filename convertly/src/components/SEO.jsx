import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, keywords, url }) {
  const siteName = "Convertly";
  const defaultUrl = "https://getconvertly.in";

  return (
    <Helmet>
      <title>{title} | {siteName}</title>
      
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={`${title} | ${siteName}`} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={`${defaultUrl}${url || ""}`} />

      {/* Twitter */}
      <meta property="twitter:title" content={`${title} | ${siteName}`} />
      {description && <meta property="twitter:description" content={description} />}
      <meta property="twitter:url" content={`${defaultUrl}${url || ""}`} />
    </Helmet>
  );
}
