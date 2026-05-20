export function whatsappLink(baseUrl, message) {
  const encoded = encodeURIComponent(message);
  if (baseUrl.includes('wa.me')) {
    return `${baseUrl}?text=${encoded}`;
  }
  return `https://wa.me/${baseUrl.replace(/\D/g, '')}?text=${encoded}`;
}

export function formatPrice(value) {
  return Number(value).toLocaleString('en-IN');
}
