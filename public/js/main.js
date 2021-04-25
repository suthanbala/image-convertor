const sessionStore = window.sessionStorage;

Dropzone.autoDiscover = false;
var uploader = new Dropzone("#file-drop", {
  url: "/upload",
  previewTemplate: `
    <div class="dz-preview dz-file-preview">
        <img data-dz-thumbnail />
        <div class="dz-details">
            <div class="dz-filename"><span data-dz-name></span></div>
            <div class="dz-size" data-dz-size></div>
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-success-mark"><span>✔</span></div>
        <div class="dz-error-mark"><span>✘</span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
    </div>
    `
});

uploader.on("complete", function (file) {
  console.log("Complete", file);
  //   uploader.removeFile(file);
});

// If no session token present, then make a call to receive the token
if (!sessionStore.getItem('authToken')) {
    axios.post("/init-session").then(data => {
      console.log(data);
      sessionStore.setItem("authToken", data.data.accessToken);
    });
}

/**
 * Given the URL, request type and the data, we send the request and return a promise
 * @param {string} url URL Endpoint
 * @param {string} method Request Type
 * @param {object} data Form Data to send
 * @returns Request Promise
 */
function request(url, method, data) {
    const options = {};
    if ( method === 'POST') {
        options.data = data;
    } else {
        options.params = data;
    }

    if ( sessionStore.getItem('authToken')) {
        options.headers = {
            'Authorization': `Bearer ${sessionStore.getItem('authToken')}`
        }
    }

    return axios({
        method,
        url,
        responseType: 'json',
        ...options,
    })
}