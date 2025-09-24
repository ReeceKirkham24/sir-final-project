fetch('https://www.nyckel.com/connect/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=1nu2aaa2j2z64wlwe0wfgup3i9yd6wam&client_secret=ivawy9c5egu3k41ydmzrm676xqj1cxvmsdo8loy5or0z0mje8zzkwi0co4z7patg'
})
.then(response => response.json())
.then(data => console.log(data));