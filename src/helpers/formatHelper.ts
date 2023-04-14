const exports = {
  getYearFromDate
};

function getYearFromDate(dateString: string) {
  const date = new Date(dateString);
  return date.getFullYear();
}

export default exports;
