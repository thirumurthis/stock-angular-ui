### Change done in order to deploy to heroku.

- installed the `npm install express --save` issue this command from where the root angular directory is created.
- The above will update the package.json and lock version of it.

- In the `server.js` we are routing the http to https traffic.
- content of the server.js is as follows.

Note: The name in the package json is provided in the below path.
```js
function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
const express = require('express');
const path = require("path");
const app = express();
const port = process.env.PORT || 5000
app.use(requireHTTPS);

//app.use(express.static('./dist/stock-mat-ui'));
app.use(express.static(path.join(__dirname, "dist/stock-mat-ui")));
console.log(' about to hit the get defintion')
app.get('/*', function (req, res) {
    //res.sendFile('index.html', { root: 'dist/stock-mat-ui/' });
    res.sendFile(path.join(__dirname+'dist/stock-mat-ui/index.html'));
});

app.listen(port,() => console.log(`App Started and listening on port ${port}!`));
```
  - For local development, comment the `app.use(requireHTTPS)` line. The app will connect to actual backend, since we build it using `ng build`

In Heroku side, create a new app login in. After that updated the deployment to point to github.
  - For some reason, the Chrome browser was not able to connect to github from heroku web page.
  - With IE, i was able to sign up to the github, and provided the repository (stock-angular-ui)
  - currently the manual deployment is selected.
