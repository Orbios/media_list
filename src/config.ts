export default {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY
  },
  rawg: {
    apiKey: import.meta.env.VITE_RAWG_API_KEY
  },
  dbFileName: 'media_list.json',
  pageSize: 10,
  descriptionMaxLength: 400
};
