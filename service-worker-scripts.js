self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    console.log('processing event');
    event.waitUntil(sendDummyPostToServer());
  }
});

function sendDummyPostToServer() {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify({firstName: 'o', lastName: 'mers'});
    let url = 'https://test2.dantab.demo2.nordlogic.com/';

    console.log('fetching.2..');
    try {
      fetch(url, {
        body: data,
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'POST',
        mode: 'cors'
      }).then((result) => {
        console.log('result:', result);
        if (result.ok) {
          return result.json();
        } else {
          reject(result);
        }
      }).then((json) => {
        resolve(json);
      }).catch((error) => {
        reject(error);
        console.log(error);
      });
    } catch (e) {
      console.log('caught error: ', e);
      reject(e);
    }
  });
}
