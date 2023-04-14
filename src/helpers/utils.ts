import config from '@/config';

const exports = {
  containsString,
  getItemsPerPage
};

function containsString(obj: any, searchStr: string) {
  return obj.toString().toLowerCase().indexOf(searchStr.toLowerCase()) !== -1;
}

function getItemsPerPage(data: any[], page: number) {
  const perPage = config.pageSize;
  const start = (page - 1) * perPage;
  const end = page * perPage;

  return data.slice(start, end);
}

export default exports;
