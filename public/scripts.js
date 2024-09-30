document.addEventListener('musickitconfigured', function () {
  console.log('musickitconfigured event triggered');
})

document.addEventListener('musickitloaded', () => {
  return fetch('/generateDeveloperToken')
    .then(response =>
      response.json()
    )
    .then(res => {
      let userKey = MusicKit.configure({
        developerToken: res.token,
        app: {
          name: 'AppleMusicKitExample',
          build: '1978.4.1'
        }
      });

      (async () => {
        const rawResponse = await fetch('/receiveUserApiToken', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userToken: userKey.storekit._userToken })
        });
      })();
    });
});