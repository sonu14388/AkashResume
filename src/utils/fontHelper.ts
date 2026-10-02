export const getResumeFontClass = (fontFamily?: string): string => {
  switch (fontFamily) {
    case 'poppins':
      return 'font-poppins';
    case 'outfit':
      return 'font-outfit';
    case 'jakarta':
      return 'font-jakarta';
    case 'montserrat':
      return 'font-montserrat';
    case 'raleway':
      return 'font-raleway';
    case 'dmsans':
      return 'font-dmsans';
    case 'space':
      return 'font-space';
    case 'serif':
    case 'merriweather':
      return 'font-merriweather';
    case 'playfair':
      return 'font-playfair';
    case 'roboto':
      return 'font-roboto';
    case 'editorial':
      return 'font-editorial';
    case 'lora':
      return 'font-lora';
    case 'crimson':
      return 'font-crimson';
    case 'cinzel':
      return 'font-cinzel';
    case 'mono':
      return 'font-mono-clean';
    case 'jetbrains':
      return 'font-jetbrains';
    case 'fira':
      return 'font-fira';
    case 'oswald':
      return 'font-oswald';
    case 'sans':
    default:
      return 'font-sans-modern';
  }
};
