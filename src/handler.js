const { parse } = require("url");
const { DEFAULT_HEADER, JPEG_IMAGE_HEADER, PNG_HANDLER, JPG_IMAGE_HEADER } = require("./util/util.js");
const { controller } = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");

const allRoutes = {
  "/photos:get": (request, response) => {
    let urlString = request.url
    let array = urlString.split('?')
    if (array[2].includes('.jpeg')) {
      response.writeHead(200, JPEG_IMAGE_HEADER)
      createReadStream(`./src/photos/${array[1]}/${array[2]}`).pipe(response)
    }

    if (array[2].includes('.png')) {
      response.writeHead(200, PNG_HANDLER)
      createReadStream(`./photos/${array[1]}/${array[2]}`).pipe(response)
    }
  },
  "/:get": (request, response) => {
    controller.getHomePage(request, response);
  },
  // GET: localhost:3000/form
  "/form:get": (request, response) => {
    controller.getFormPage(request, response);
  },
  // POST: localhost:3000/form
  "/form:post": (request, response) => {
    controller.sendFormData(request, response);
  },
  // POST: localhost:3000/images
  "/images:post": (request, response) => {
    controller.uploadImages(request, response);
  },
  // GET: localhost:3000/feed
  // Shows instagram profile for a given user
  "/feed:get": (request, response) => {
    let currentUrl = request.url
    let array = currentUrl.split('?')
    let username = array[1].split('=')[1]
    controller.getUserFeed(request, response, username);
  },

  "/pictures:get": (request, response) => {
    let urlString = request.url
    let array = urlString.split('?')
    let folder = array[1]
    let filename = array[2]
    if (filename.includes('.jpeg')) {
      response.writeHead(200, JPEG_IMAGE_HEADER)
      createReadStream(`./src/photos/${array[1]}/${array[2]}`).pipe(response)
    }

    if (filename.includes('.png')) {
      response.writeHead(200, PNG_HANDLER)
      createReadStream(`./src/photos/${array[1]}/${array[2]}`).pipe(response)
    }

    if (filename.includes('.jpg')) {
      response.writeHead(200, JPG_IMAGE_HEADER)
      createReadStream(`./src/photos/${array[1]}/${array[2]}`).pipe(response)
    }

  },

  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(
      response
      );
    },
  };
  
  function handler(request, response) {
  const { url, method } = request;
  
  const { pathname } = parse(url, true);
  
  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;
  
  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
    );
  }
  
  function handlerError(response) {
    return (error) => {
      console.log("Something bad has  happened**", error.stack);
      response.writeHead(500, DEFAULT_HEADER);
      response.write(
        JSON.stringify({
          error: "internet server error!!",
        })
        );
        
        return response.end();
      };
    }
    
    module.exports = handler;
    