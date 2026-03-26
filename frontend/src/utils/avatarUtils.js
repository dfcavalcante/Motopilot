export const getUserInitials = (nome = '', email = '') => {
  const textoBase = (nome || '').trim() || (email || '').trim() || 'U';

  const partes = textoBase.split(/\s+/).filter(Boolean).slice(0, 2);

  if (partes.length === 0) {
    return 'U';
  }

  if (partes.length === 1) {
    return (
      partes[0]
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 2)
        .toUpperCase() || 'U'
    );
  }

  return `${partes[0][0] || ''}${partes[1][0] || ''}`.toUpperCase();
};

export const getAvatarColor = (nome = '', email = '') => {
  const textoBase = (nome || '').trim() || (email || '').trim() || 'usuario';
  let hash = 0;

  for (let i = 0; i < textoBase.length; i += 1) {
    hash = textoBase.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 42%)`;
};
