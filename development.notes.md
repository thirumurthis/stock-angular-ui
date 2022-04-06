### For local development below needs to be done.
  - Update the package.json start from `node server.js` to `ng server`
  - mostly if the application is running in local use `http://localhost:8080/` in the environment.json

 - To test the deployment locally use `ng build` and then use `node server.js` before deploying to heroku.
 

 Few experince based on the development.

#### how to provide spacing between the button in CSS
 use below css style
```
.mat-raised-button ~ .mat-raised-button {
  margin-left: 10px;
}
```

##### The current app, stores the user id info in StorageSession and API key in LocalStorage.

##### During deployment the backend had issues reporint CORS error
Error message from Browser, the reason is maily the browser include the CORS header.

```
Access to XMLHttpRequest at 'http://localhost:8080/stock/v1/stock-info' from origin 'http://localhost:4200' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
Fix is, in the websecurity configurator -> configure method, include below configuration
```
 .headers()
            // the headers you want here. This solved all my CORS problems! 
            .addHeaderWriter(new StaticHeadersWriter("Access-Control-Allow-Origin", "*"))
            .addHeaderWriter(new StaticHeadersWriter("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT"))
            .addHeaderWriter(new StaticHeadersWriter("Access-Control-Max-Age", "3600"))
            .addHeaderWriter(new StaticHeadersWriter("Access-Control-Allow-Credentials", "true"))
            .addHeaderWriter(new StaticHeadersWriter("Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization"));
```

#### Converting the String to JSON object, use `JSON.parse()`.
#### using template string also helps

#### inital development started using below commands

Install angulare cli.
```
$ npm install -g @angular/cli
$ ng --version
```

Create a folder and create angular project
- using npx cli package
```
npx @angular/cli@13 new <folder-for-the-project>
when prompted add yes for route
choose css
```

- navigate to the created foler 
install few css layout system 
```
#npm install -E @angular/flex-layout@latest
Note: we can user specific version like 13.0.0-beta.36
```
- add mateiral to the project
```
ng add @angular/material@13
# this also installs the @angular/cdk which is component development kit for material component to work
```
