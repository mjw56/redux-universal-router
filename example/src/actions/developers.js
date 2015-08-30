const developers = {
  gpbl: {
    twitter: "gpblv",
    github: "gpbl"
  },
  gaearon: {
    twitter: "dan_abramov",
    github: "gaearon"
  }
}

export function requestDeveloper({ name }) {
  return {
    type: "REQUEST_DEVELOPER",
    payload: new Promise( (resolve, reject) => {

      // in a real app, the promise would be resolved or rejected
      // after requesting an external API...

      if (!name) {
        // simulate a server error, e.g. the API returns a 500 status code
        const error = new Error("Missing name parameter");
        error.statusCode = 500; // Will be used with server-side rendering
        reject(error);
        return;
      }
      const developer = developers[name];

      setTimeout(() => {
        if (!developer) {
          // simulate a not-found error, e.g. the API says the resource is not found
          const error = new Error("Developer not found");
          error.statusCode = 404; // Will be used with server-side rendering
          reject(error)
          return;
        }
        resolve({
          [name]: developers[name]
        });
      }, 2000);

    })
  };
}

export function requestAllDevelopers() {
  return {
    type: "REQUEST_ALL_DEVELOPERS",
    payload: developers
  }
}
