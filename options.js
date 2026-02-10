const CHANNEL_LIST_KEY = "channelList";

//get list from browser storage
async function getList() {
    let result = await browser.storage.local.get(CHANNEL_LIST_KEY);
    //if nothing in storage, return empty array
    return result[CHANNEL_LIST_KEY] || [];
}

//save list to browser storage
async function saveList(list) {
  await browser.storage.local.set({
    [CHANNEL_LIST_KEY]: list
  });
}

//add channel to list
async function addChannel(name) {
    let list = await getList();

    //check if the name already exists 
    const isDuplicate = list.some(item => item.toLowerCase() === name.toLowerCase());
    if(!isDuplicate) {
        list.push(name);
        await saveList(list);
        renderList();
    } else {
        alert("Channel is already on the list");
    }
}

//delete channel from list
async function deleteChannel(name) {
  let list = await getList();

  //remove  item from list
  list = list.filter(ch => ch !== name);

  await saveList(list);
  //update list visual
  renderList();
}

//show list in options popup
async function renderList() {
  const list = await getList();
  const ul = document.getElementById("channelList");
  ul.innerHTML = "";

  list.forEach(channel => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = channel;
    const button = document.createElement("button");
    button.textContent = "X";
    button.style.marginLeft = "8px";

    //listen for deletion
    button.addEventListener("click", async () => {
      await deleteChannel(channel);
    });

    li.appendChild(text);
    li.appendChild(button);
    ul.appendChild(li);
  });
}

//listen for "Add" button clicks 
document.getElementById("addButton").addEventListener("click", async () => {
  let input = document.getElementById("channelName");
  let name = input.value.trim();

  if (name) {
    await addChannel(name);
    //empty the field after addition
    input.value = "";
  }
});

//accept Enter key for "Add"
document.getElementById("channelName").addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    document.getElementById("addButton").click();
  }
});

//load list when options opened
renderList();