# Media List

`Media List` is an **Electron** application built with **Vite** and **React**, designed to help users manage their collection of movies. In future releases, the application will also support managing collections of books and games.

## Features

### `Import movies from CSV file`

**Media List** allows users to import movies from a CSV file downloaded from IMDB. The imported data is stored in a JSON file on the local machine, or it can be stored in Dropbox.

### `Add, edit, or delete movies`

Users can add new movies to their collection, edit the details of existing movies, or delete movies they no longer want to keep track of.

### `Search, pagination, sorting, and filtering`

The current version of **Media List** includes searching movies, pagination, sorting by _title_, _year_, and _runtime_, and a filter for "_All movies_," "_Watched_" movies, and "_Wishlist_" movies.

### `Import movie by searching on IMDb`

Users can search for movies on IMDb and import them into their collection directly from the application.

## Future Enhancements

In future releases, **Media List** will also support managing collections of books and games.

## For developers

Project is based on following template: [https://github.com/electron-vite/electron-vite-react](https://github.com/electron-vite/electron-vite-react)

```bash
# start local dev env
npm run start

# build installation package for current OS
npm run build
```

## Install (from the latest release)

Download the app from [the latest release](https://github.com/Orbios/media_list/releases).
