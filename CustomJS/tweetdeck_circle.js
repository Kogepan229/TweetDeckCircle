// ==UserScript==
// @name         TweetDeckCircle
// @namespace    http://kogepan.net/
// @version      0.1
// @description  try to take over the world!
// @author       Kogepan229
// @match        https://tweetdeck.twitter.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

let CircleTweetList = []

function injectXHR() {
  let oldXHROpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function (method, url) {
    // tweet data
    if (
      url.indexOf('https://api.twitter.com/1.1/statuses/home_timeline.json') == 0 ||
      url.indexOf('https://api.twitter.com/1.1/lists/statuses.json') == 0
    ) {
      this.addEventListener('load', function () {
        let responseBody = this.responseText
        let TweetsData = JSON.parse(this.responseText)
        for (let i = 0; i < TweetsData.length; i++) {
          if (TweetsData[i].limited_actions != undefined && TweetsData[i].limited_actions === 'limit_trusted_friends_tweet') {
            CircleTweetList.push(TweetsData[i].id_str)
          }
        }
      })
    }

    return oldXHROpen.apply(this, arguments)
  }
}

function setObserver() {
  const documentObserver = new MutationObserver(function (mutations1) {
    const tweetContainer = document.getElementById('container')
    // containerがあれば監視開始
    if (tweetContainer != null) {
      documentObserver.disconnect()
      const containerObserver = new MutationObserver(function (mutations2) {
        const nodeList = tweetContainer.querySelectorAll('[data-tweet-id]')
        let circleTweetNodeList = []
        nodeList.forEach(node => {
          CircleTweetList.forEach(tweetid => {
            if (node.nodeName === 'ARTICLE' && node.getAttribute('data-tweet-id') === tweetid) {
              circleTweetNodeList.push(node)
            }
          })
        })

        circleTweetNodeList.forEach(node => {
          node.setAttribute('style', 'background-color: #defaf1;')
          node.setAttribute('data-circle', 'true')
        })
      })
      containerObserver.observe(tweetContainer, {
        childList: true,
        subtree: true,
      })
    }
  })
  documentObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

;(function () {
  'use strict'
  injectXHR()
  setObserver()
  // Your code here...
})()
