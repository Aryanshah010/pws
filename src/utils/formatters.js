/**
 * Maps English digits to Nepali digits
 */
export const toNepaliDigits = (num) => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num
    .toString()
    .split('')
    .map((char) => {
      if (char >= '0' && char <= '9') {
        return nepaliDigits[parseInt(char, 10)];
      }
      return char;
    })
    .join('');
};

/**
 * Formats a currency amount in rupees, converting digits to Nepali if the language is 'ne'
 */
export const formatCurrency = (amount, lang = 'en') => {
  const formattedNum = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);

  if (lang === 'ne') {
    return `रु ${toNepaliDigits(formattedNum)}`;
  }
  return `Rs. ${formattedNum}`;
};

/**
 * Formats a raw number (e.g. quantity or points), converting digits to Nepali if required
 */
export const formatNumber = (num, lang = 'en') => {
  if (lang === 'ne') {
    return toNepaliDigits(num.toString());
  }
  return num.toString();
};
