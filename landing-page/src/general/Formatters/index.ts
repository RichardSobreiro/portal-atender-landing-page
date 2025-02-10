export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();

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
