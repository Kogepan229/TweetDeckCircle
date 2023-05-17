# TweetDeckCircle

## 概要

TweetDeck でサークルツイートを識別するための Chrome 拡張機能・CustomJS

## 色の変更

カスタム CSS で以下のように設定することで色を変更することができます
(any-color の部分に任意の色を記述)

```css
article[data-circle="true"] {
  background-color: any-color !important;
}
```
