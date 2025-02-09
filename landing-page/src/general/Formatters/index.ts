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
