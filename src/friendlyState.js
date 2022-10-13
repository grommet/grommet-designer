const friendlyState = (key, design) => {
  const designs = JSON.parse(localStorage.getItem('designs') || '[]');
  if (!design.name) return 'unknown';
  if (!designs.find((des) => des.id === design.id || des.name === design.name))
    return 'orphaned';
  if (key === design.id) return 'cached';
  if (key === design.name) {
    if (!design.id) return 'unpublished';
    if (design.date !== design.publishedDate) return 'changed';
    return 'published';
  }
  return 'unknown';
};

export default friendlyState;
