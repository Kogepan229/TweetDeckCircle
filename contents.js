// in content.js

let CircleTweetList = []

const documentObserver = new MutationObserver(function(mutations1) {
  const tweetContainer = document.getElementById("container")
  // containerがあれば監視開始
  if (tweetContainer != null) {
    documentObserver.disconnect()
    const containerObserver = new MutationObserver(function(mutations2) {
      const nodeList = tweetContainer.querySelectorAll("[data-tweet-id]")
      let circleTweetNodeList = []
      nodeList.forEach(node => {
        CircleTweetList.forEach(tweetid => {
          if (node.nodeName === "ARTICLE" && node.getAttribute('data-tweet-id') === tweetid) {
            circleTweetNodeList.push(node)
          }
        })
      })

      circleTweetNodeList.forEach(node => {
        node.setAttribute('style', "background-color: #defaf1;")
      })

    })
    containerObserver.observe(tweetContainer, {
      childList: true,
      subtree: true
    })

  }
})
documentObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
})

const circleProc = (body) => {
  let TweetsData = JSON.parse(body)
  for (let i=0;i<TweetsData.length;i++) {
    if (TweetsData[i].limited_actions != undefined && TweetsData[i].limited_actions === "limit_trusted_friends_tweet") {
      CircleTweetList.push(TweetsData[i].id_str)
    }
  }
}

const dataContainer = document.createElement("div")
const dataHolder = document.createElement("div");
dataHolder.setAttribute("id", "TweetDeckCircleDataHolder");
document.body.appendChild(dataContainer);
dataContainer.appendChild(dataHolder)
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == "attributes") {
      const responseBody = mutation.target.getAttribute('data-response')
      circleProc(responseBody)
    }
  });
});
observer.observe(dataHolder, {
  attributes: true
});

const injectedScript =
  "(" +
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
  } +
  ")();";

const injectScript = () => {
  let script = document.createElement("script");
  script.textContent = injectedScript;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};

injectScript()