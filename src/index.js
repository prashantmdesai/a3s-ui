// Imports
var express = require('express');
var path = require('path');

// Node server
var server = express();

// When you create a Node.js app, by default, it's going to use hostingstart.html as the 
// default document unless you configure it to look for a different file
// https://blogs.msdn.microsoft.com/waws/2017/09/08/things-you-should-know-web-apps-and-linux/#NodeHome
var options = {
    index: 'index.html'
};

// Middleware to redirect to www
server.all("*", (request, response, next) => {
    let host = request.headers.host;

    if (host.match(/^www\..*/i)) {
        next();
    } else {
        response.redirect(301, "https://www." + host + request.url);
    }
});

// This needs to be after middleware configured for middleware to be applied
server.use('/', express.static('/home/site/wwwroot', options));

// Angular routing does not work in Azure by default
// https://stackoverflow.com/questions/57257403/how-to-host-an-angular-on-azure-linux-web-app
const passthroughExtensions = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
    '.eot'
];

// Route to index unless in passthrough list
server.get('*', (request, response) => {
    if (passthroughExtensions.filter(extension => request.url.indexOf(extension) > 0).length > 0) {
        response.sendFile(path.resolve(request.url));
    } else {
        response.sendFile(path.resolve('index.html'));
    }
});

server.listen(process.env.PORT);