
// Simple i18n utility for error pages
// This can be expanded later to support more comprehensive internationalization

type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja';

interface ErrorPageTranslations {
  pageNotFound: string;
  pageNotFoundDescription: string;
  returnToHomepage: string;
}

const translations: Record<SupportedLanguage, ErrorPageTranslations> = {
  en: {
    pageNotFound: 'Page Not Found',
    pageNotFoundDescription: 'The page you're looking for doesn't exist or has been moved.',
    returnToHomepage: 'Return to homepage'
  },
  es: {
    pageNotFound: 'Página No Encontrada',
    pageNotFoundDescription: 'La página que estás buscando no existe o ha sido movida.',
    returnToHomepage: 'Volver a la página principal'
  },
  fr: {
    pageNotFound: 'Page Non Trouvée',
    pageNotFoundDescription: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    returnToHomepage: 'Retourner à l\'accueil'
  },
  de: {
    pageNotFound: 'Seite nicht gefunden',
    pageNotFoundDescription: 'Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.',
    returnToHomepage: 'Zurück zur Startseite'
  },
  ja: {
    pageNotFound: 'ページが見つかりません',
    pageNotFoundDescription: 'お探しのページは存在しないか、移動しました。',
    returnToHomepage: 'ホームページに戻る'
  }
};

// Helper function to get user's browser language
export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split('-')[0];
  return (translations[browserLang as SupportedLanguage]) 
    ? browserLang as SupportedLanguage 
    : 'en';
};

// Get translations based on language
export const getErrorPageTranslations = (lang?: SupportedLanguage): ErrorPageTranslations => {
  const language = lang || getBrowserLanguage();
  return translations[language] || translations.en;
};
