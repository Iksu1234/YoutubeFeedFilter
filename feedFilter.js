let storedChannelList = [];
let shortsToggle = false;

//gets the channel list from browser storage and runs once to hide shorts and channels
async function init() {
  let result = await browser.storage.local.get("channelList");
  storedChannelList = result.channelList || [];

  result = await browser.storage.local.get("hideShorts");
  shortsToggle = result.hideShorts;
  syncFeed();
}

//hides or unhides channels on "feed/subscriptions" that are or are not on the list
function syncFeed() {
  hideShorts();

  //finds all video elements
  const allVideos = document.querySelectorAll("ytd-rich-item-renderer");

  //goes through the elements to find
  allVideos.forEach(video => {
    //find the channel name link
    const channelLink = video.querySelector('a[href*="/@"]');
    if (!channelLink) return;

    const channelName = channelLink.textContent.trim();

    //hide the channel if name is on the list
    if (storedChannelList.includes(channelName)) {
      if (video.style.display !== "none") {
        video.style.display = "none";
      }
    //unhide if the name is not on the list
    } else {
      if (video.style.display === "none") {
        video.style.display = "";
      }
    }
  });
}

//hides shorts from "feed/subscriptions"
function hideShorts() {
  const foundSections = document.querySelectorAll("ytd-rich-section-renderer");
  
  foundSections.forEach((section, index) => {
    // Skip the first title section
    if (index !== 0) {
      section.style.display = shortsToggle ? "none" : ""; 
    }
  });
}

//observes the feed to find channels to hide or unhide
const observer = new MutationObserver(() => {
  syncFeed();
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});

//syncs the feed when the UI list is changed
browser.storage.onChanged.addListener((changes) => {
  //channel list
  if (changes.channelList) {
    storedChannelList = changes.channelList.newValue || [];
  }
  //shorts toggle
  if (changes.hideShorts) {
    shortsToggle = changes.hideShorts.newValue;
  }
  syncFeed();
});

init();