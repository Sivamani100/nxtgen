import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/NXTGEN.jpeg',
  url,
  type = 'website'
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `https://nxtgen-in.vercel.app${location.pathname}`;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update primary meta tags
    if (title) {
      updateMetaTag('title', title);
      updatePropertyTag('og:title', title);
      updatePropertyTag('twitter:title', title);
    }

    if (description) {
      updateMetaTag('description', description);
      updatePropertyTag('og:description', description);
      updatePropertyTag('twitter:description', description);
    }

    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph and Twitter tags
    updatePropertyTag('og:url', currentUrl);
    updatePropertyTag('twitter:url', currentUrl);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:image', `https://nxtgen-in.vercel.app${image}`);
    updatePropertyTag('twitter:image', `https://nxtgen-in.vercel.app${image}`);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

  }, [title, description, keywords, image, currentUrl, type]);

  return null;
};

export default SEO; 