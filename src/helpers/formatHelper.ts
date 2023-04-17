const exports = {
  truncateTextToLength,
  getYearFromDate
};

function truncateTextToLength(text = '', length, truncateFrom = 'start') {
  if (!text || !length || text.length <= length) return text;

  switch (truncateFrom) {
    case 'middle':
      let segmentSize = Math.ceil((length - 3) / 2);
      return text.substring(0, segmentSize) + '...' + text.substring(text.length - segmentSize, text.length);
    case 'start':
      return text.substring(0, length) + '...';
    case 'end':
      return '...' + text.substring(text.length - length, text.length);
    default:
      return text;
  }
}

function getYearFromDate(dateString: string) {
  const date = new Date(dateString);
  return date.getFullYear();
}

export default exports;
