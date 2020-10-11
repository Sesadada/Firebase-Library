const container = document.querySelector(".container");
const form = document.querySelector("#myForm");
const search = document.querySelector("#search");

//create element and render the book(s)
const renderBook = (doc) => {
  let title = document.createElement("span"); // create emtpy element
  let author = document.createElement("span"); // create emtpy element
  let pages = document.createElement("span"); // create emtpy element
  let y = document.createElement("BUTTON"); //create delete button
  const div = document.createElement("div"); //create div as base
  title.innerHTML = `"${doc.data().title.italics()}",  book by`; //relleno elemento
  author.innerHTML = `${doc.data().author.bold()}`; // relleno elemento
  pages.textContent = `- ${doc.data().pages} pages`;
  y.textContent = "x";

  y.classList.add("delete");
  div.classList = "card";
  div.setAttribute("data-id", doc.id);

  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(pages);
  x = document.createElement("INPUT"); //create checkbox button
  x.setAttribute("type", "checkbox");
  x.classList.add("toggle");
  //render checked if true, uncheckes if false ----> x.setAttribute("checked", true);
  div.append(x);
  div.appendChild(y);
  container.appendChild(div);

  y.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("books").doc(id).delete();
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("books").add({
    title: form.title.value,
    author: form.author.value,
    pages: form.pages.value,
    read: form.read.value,
  });
  form.title.value = "";
  form.author.value = "";
  form.pages.value = "";
  //form.checkit.checked = "";
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
