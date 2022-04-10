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

### how to route to other components.
 - From the component ts file, we can inject the Router module and use the roter.navigate.
 - From the Template or html component file, we can use the routerLink options.

### how to make the selected route highlighted?
  - in the template html component, we can use the `routerLinkActive="active"`

### using the Router Gaurd, we can use `CanActivate` gaurd
  - use `$ ng g gaurd auth`, choose the option CanActivate when prompted.
  - Note: from canActivate() returns true from this gaurd then the route will be enabled.
    - In our case we can check if the jwt token is available to make sure the user is logged in.
  - The gaurds needs to be implemented for a route and registed. (gaurds are like service)
  - We need to register the service in the provided array
      - Udpate the `app.modules.ts` providers with the create auth gaurd
  - Apply the gaurd to route. in `app-routing.module.ts` update the canActivate gaurd to specific route
    - in this case `  {path: 'stock-info',component: StockResultComponent, canActivate:[AuthGuard]},`
    - The above routing means we can have multiple gaurd before activiating that route.
  - Gaurd is used included for the route, once that Gaurd is validated the route will rendered

  ### How to make the input to type upper case 
  - we need to use this event to uppercase, and set to the ngModel two way bind value directly
  ```
   <input matInput placeholder="Symbol" [(ngModel)]="sybmol" name="symbol" (ngModelChange)="sybmol= $event.toUpperCase()" required>
  ```
 ### How to reload the component when the dialog is closed.
   - First created a component for the dialog
   - Then using the Mat Dialog module, then use open to open the dialog.
   - use the close event to handle the close event to reload.
   - below code reloads the image.
   ```
     let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl],{ state: { msg: message }});
   ```
 ###### In this project there are few typscript class are not being used
  - the stock-input and stock-delete components can be removed latter. - udpated April/9/2022