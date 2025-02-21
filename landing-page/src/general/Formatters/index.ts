export const calculateAge = (dob: string) => {
  if (!dob) return '';
  const [day, month, year] = dob.split('/');
  if (!day || !month || !year) return '';

  const birthDate = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age.toString();
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';

  try {
    const cleanDate = dateString.split('T')[0];
    // Ensure dateString follows "YYYY-MM-DD" format before parsing
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(cleanDate)) {
      throw new Error('Invalid date format');
    }

    // Split the date manually to avoid JavaScript Date inconsistencies
    const [year, month, day] = cleanDate.split('-');

    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Data inválida';
  }
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Format based on length (mobile: 11 digits, landline: 10 digits)
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone; // Return as is if it doesn't match expected formats
};

export const formatCpfCnpj = (value: string) => {
  const digits = value.replace(/\D/g, ''); // Remove non-numeric characters

  if (digits.length <= 11) {
    // CPF Format: 999.999.999-99
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  } else {
    // CNPJ Format: 99.999.999/9999-99 (Max 14 digits)
    return digits
      .slice(0, 14) // Restrict to 14 digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/\/(\d{4})(\d)/, '/$1-$2');
  }
};

export const formatCurrency = (value: string): string => {
  // Remove any non-numeric characters except commas
  let numericValue = value.replace(/\D/g, '');

  // Ensure at least two decimal places
  while (numericValue.length < 3) {
    numericValue = '0' + numericValue;
  }

  // Remove unnecessary leading zeros if the length is greater than 5 (like "001,59")
  if (value.length > 5) {
    while (numericValue.length > 3 && numericValue.startsWith('0')) {
      numericValue = numericValue.substring(1); // Remove first zero
    }
  }

  // Add thousands separator (Brazilian format)
  const integerPart = numericValue
    .slice(0, -2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = numericValue.slice(-2);

  return `${integerPart},${decimalPart}`;
};
