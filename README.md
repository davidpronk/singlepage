# A single page web application

A single page web app that shows content (pages) from the OMDb (Open Movie Database) in a grid. Navigate in four directions by clicking the arrows or cursor keys.

Run `npm install` to install external dependencies

The following configuration options can be set in `js/main.js`

*   `numberOfColumns` The number of columns of pages
   
*   `blockDuringTransform` Allow one navigation transition at the time, i.e. block navigation when a transform is in progress
   
*   `randomContent` Words used to query the OMDb (Open Movie Database) at http://www.omdbapi.com. The results are used to fill the content elements (pages)
