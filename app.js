const container = document.querySelector(".container");
const form = document.querySelector("#myForm");
const search = document.querySelector("#search");

//create element and render the book(s)
const renderBook = (doc) => {
  let title = document.createElement("span");
  let author = document.createElement("span");
  let pages = document.createElement("span");
  let x = document.createElement("INPUT");
  let y = document.createElement("BUTTON");
  const div = document.createElement("div"); //create div as base
  title.innerHTML = `"${doc.data().title.italics()}",  book by`; //relleno elemento
  author.innerHTML = `${doc.data().author.bold()}`; // relleno elemento
  pages.textContent = `- ${doc.data().pages} pages`;
  x.setAttribute("type", "checkbox");
  x.classList.add("toggle");
  if (doc.data().read == true) {
    x.setAttribute("checked", true);
  }
  y.textContent = "x";

  y.classList.add("delete");
  div.classList = "card";
  div.setAttribute("data-id", doc.id);

  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(pages);
  div.append(x);
  div.appendChild(y);
  container.appendChild(div);

  y.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("books").doc(id).delete();
  });

  //toggling data
  x.addEventListener("click", (k) => {
    k.stopPropagation();
    if (k.target.classList == "toggle") {
      if (k.target.checked == true) {
        console.log("data-id " + doc.id);
        db.collection("books").doc(doc.id).update({ read: true });
        k.read = true;
      } else {
        console.log("data-id " + doc.id);
        db.collection("books").doc(doc.id).update({ read: false });
        k.read = false;
      }
    }
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.title.value == "" && form.author.value == "") {
    alert("You need to write the title or the author at least, you lazy");
  }
  if (typeof parseInt(form.pages.value) != "number") {
    alert("You need to introduce a number of pages");
  } else {
    db.collection("books").add({
      title: form.title.value,
      author: form.author.value,
      pages: form.pages.value,
      read: form.read.checked,
    });
    form.title.value = "";
    form.author.value = "";
    form.pages.value = "";
    form.read.value = "";
  }
});

db.collection("books")
  .orderBy("title")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderBook(change.doc);
      } else if (change.type == "removed") {
        let remove = container.querySelector("[data-id=" + change.doc.id + "]");
        container.removeChild(remove);
      }
      console.log(change.doc.data());
    });
  });

const filterItems = (e) => {
  //convert to lowercase
  let text = e.target.value.toLowerCase();
  //get list
  let items = container.getElementsByTagName("div");
  console.log(text);
  //conversion to an array
  Array.from(items).forEach(function (item) {
    let itemName = item.firstChild.textContent;
    console.log(itemName);
    if (itemName.toLowerCase().indexOf(text) != -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

search.addEventListener("keyup", filterItems);
