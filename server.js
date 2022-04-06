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