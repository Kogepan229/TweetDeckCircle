// content.js

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

// inject
var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);