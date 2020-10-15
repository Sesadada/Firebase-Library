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

  //render checked if true, uncheckes if false ----> x.setAttribute("checked", true);
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
        console.log("data-id " + doc.id + "just once");
        db.collection("books").doc(doc.id).update({ read: false });
        k.read = false;
      } else {
        console.log("data-id " + doc.id + "else");
        db.collection("books").doc(doc.id).update({ read: true });
        k.read = true;
      }
    }
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.title.value == "" && form.author.value == "") {
    alert("You need to write the title or the author at leaste, you lazy");
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

// ////

// const items = document.querySelector("#items");
// const form = document.querySelector("#myForm");

// //create element and render cafe
// function renderBook(doc) {
//   let div = document.createElement("div");
//   let title = document.createElement("span");
//   let author = document.createElement("span");
//   let pages = document.createElement("span");
//   let read = document.createElement("INPUT");
//   let cross = document.createElement("button");

//   div.setAttribute("data-id", doc.id);
//   div.classList = "card";
//   title.textContent = doc.data().title;
//   author.textContent = doc.data().author;
//   pages.textContent = doc.data().pages;
//   read.setAttribute("type", "checkbox");
//   read.classList.add("toggle");
//   if (read.checked == true) {
//     read.setAttribute("checked", true);
//   } else {
//     read.setAttribute("checked", false);
//   }

//   cross.textContent = "x";

//   div.appendChild(title);
//   div.appendChild(author);
//   div.appendChild(pages);
//   div.appendChild(read);
//   div.appendChild(cross);
//   items.appendChild(div);

//   //deleting data
//   cross.addEventListener("click", (e) => {
//     e.stopPropagation();
//     let id = e.target.parentElement.getAttribute("data-id");
//     db.collection("books").doc(id).delete();
//   });
//   //toggling data
//   read.addEventListener("click", (k) => {
//     k.stopPropagation();
//     if (k.target.classList == "toggle") {
//       if (k.read == true) {
//         console.log("data-id " + doc.id);
//         db.collection("books").doc(doc.id).update({ read: false });
//         k.read = false;
//       } else {
//         console.log("data-id " + doc.id);
//         db.collection("books").doc(doc.id).update({ read: true });
//         k.read = true;
//       }
//     }
//   });
// }

// // saving data
// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   db.collection("books").add({
//     title: form.title.value,
//     author: form.author.value,
//     pages: form.pages.value,
//     read: form.read.checked,
//   });
//   form.title.value = "";
//   form.author.value = "";
//   form.pages.value = "";
//   form.read.value = "";
// });

// //realtime listener

// db.collection("books")
//   .orderBy("title")
//   .onSnapshot((snapshot) => {
//     let changes = snapshot.docChanges();
//     changes.forEach((change) => {
//       if (change.type == "added") {
//         renderBook(change.doc);
//       } else if (change.type == "removed") {
//         let li = items.querySelector("[data-id=" + change.doc.id + "]");
//         items.removeChild(li);
//       }
//       console.log(change.doc.data());
//     });
//   });
