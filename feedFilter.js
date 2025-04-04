var observer = new MutationObserver(function (mutationsList, observer) {
  var xpath = "//ytd-rich-shelf-renderer[@is-shorts='']";
  var matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (matchingElement != null) {
    matchingElement.style.display = "none";
    observer.disconnect(); // Stop observing once the element is found
  }
});

observer.observe(document.body, { childList: true, subtree: true });
