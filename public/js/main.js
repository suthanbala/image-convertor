const sessionStore = window.sessionStorage;
Dropzone.autoDiscover = false;
let uploader;


function initializeDropZone() {
    uploader = new Dropzone('#file-drop', {
        url: '/upload',
        headers: {
            Authorization: `Bearer ${sessionStore.getItem('authToken')}`
        },
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

    uploader.on('complete', function (file) {
        console.log('Complete', file);
    });
    return Promise.resolve(true);
}

/**
 * Initialize the user session
 * @returns Promise
 */
function initializeSession() {
    return axios.post('/init-session').then((data) => {
        sessionStore.setItem('authToken', data.data.accessToken);
    });
}

function loadUserFiles() {
    return request('/user-files', 'GET');
}

function init() {
    return initializeDropZone().then(() => loadUserFiles());
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
    if (method === 'POST') {
        options.data = data;
    } else {
        options.params = data;
    }

    if (sessionStore.getItem('authToken')) {
        options.headers = {
            Authorization: `Bearer ${sessionStore.getItem('authToken')}`
        };
    }

    return axios.request({
        method,
        url,
        responseType: 'json',
        ...options
    });
}



// If no session token present, then make a call to receive the token
if (!sessionStore.getItem('authToken')) {
    initializeSession().then(init);
} else {
    request('/validate-user', 'GET').then(init).catch((err) => {
        console.log(err)
        initializeSession().then(init);
    })
}

document.getElementById('download-archive').addEventListener('click', e => {
    request('/download-archive', 'GET').then(data => {
        console.log("Initiated");
    })
})