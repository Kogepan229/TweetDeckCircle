(
  function() {
    // define monkey patch function
    const monkeyPatch = () => {
      let oldXHROpen = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function(method, url) {
        // tweet data
        if (url.indexOf("https://api.twitter.com/1.1/statuses/home_timeline.json") == 0) {
          this.addEventListener("load", function() {
            let responseBody = this.responseText;
            document.getElementById('TweetDeckCircleDataHolder').setAttribute('data-response', responseBody)
          });
        }

        return oldXHROpen.apply(this, arguments);
      };
    };
    monkeyPatch();
  }
)()