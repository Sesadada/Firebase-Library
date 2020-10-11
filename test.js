const items = document.querySelector("#items");
const form = document.querySelector("#myForm");

//create element and render cafe
function renderBook(doc) {
  let div = document.createElement("div");
  let title = document.createElement("span");
  let author = document.createElement("span");
  let pages = document.createElement("span");
  let read = document.createElement("INPUT");
  let cross = document.createElement("button");

  div.setAttribute("data-id", doc.id);
  div.classList = "card";
  title.textContent = doc.data().title;
  author.textContent = doc.data().author;
  pages.textContent = doc.data().pages;
  read.setAttribute("type", "checkbox");
  read.classList.add("toggle");
  if (read.checked == true) {
    read.setAttribute("checked", true);
  } else {
    read.setAttribute("checked", false);
  }

  cross.textContent = "x";

  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(pages);
  div.appendChild(read);
  div.appendChild(cross);
  items.appendChild(div);

  //deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("books").doc(id).delete();
  });
  //toggling data
  read.addEventListener("click", (k) => {
    k.stopPropagation();
    if (k.target.classList == "toggle") {
      if (k.read == true) {
        console.log("data-id " + doc.id);
        db.collection("books").doc(doc.id).update({ read: false });
        k.read = false;
      } else {
        console.log("data-id " + doc.id);
        db.collection("books").doc(doc.id).update({ read: true });
        k.read = true;
      }
    }
  });
}

// saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();

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
});

//realtime listener

db.collection("books")
  .orderBy("title")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderBook(change.doc);
      } else if (change.type == "removed") {
        let li = items.querySelector("[data-id=" + change.doc.id + "]");
        items.removeChild(li);
      }
      console.log(change.doc.data());
    });
  });

// ////////
// let myLibrary = [];
// let x; //checkbox
// let y; // delete

// const container = document.querySelector(".container");
// const author = document.querySelector("#author");
// const title = document.querySelector("#title");
// const pages = document.querySelector("#pages");
// const checkit = document.querySelector("#check");
// const sub = document.querySelector(".sub");

// //book constructor & prototype
// function Book(title, author, pages, read) {
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.read = read;
// }

// Book.prototype = {
//   addBook() {
//     myLibrary.push(this);
//   },
//   displayBook() {
//     console.log(
//       `${this.title} by ${this.author}, ${this.pages} pages. Read: ${this.read}`
//     );
//     return `${this.title} by ${this.author}, ${this.pages} pages.`;
//   },
// };

// sub.addEventListener("click", () => {
//   if (title.value == "" || author.value == "" || pages == "") {
//     prompt("You cannot add an empty book, write one at least");
//   } else {
//     const div = document.createElement("div");
//     container.append(div);
//     div.classList = "card";
//     div.setAttribute("id", title.value);
//     const newBook = new Book(
//       title.value,
//       author.value,
//       pages.value,
//       checkit.checked
//     );
//     newBook.addBook();
//     x = document.createElement("INPUT");
//     x.setAttribute("type", "checkbox");
//     x.classList.add("toggle");
//     y = document.createElement("BUTTON");
//     y.classList.add("delete");
//     y.innerHTML = "x";
//     if (checkit.checked == true) {
//       div.innerHTML += `${newBook.displayBook()} Read: `;
//       x.setAttribute("checked", true);
//       div.append(x);
//       div.append(y);
//     } else {
//       div.innerHTML += `${newBook.displayBook()} Read: `;
//       div.append(x);
//       div.append(y);
//     }
//     /////----------------------------------------------firebase below
//     db.collection("books")
//       .add({
//         title: newBook.title,
//         author: newBook.author,
//         pages: newBook.pages,
//         read: newBook.read,
//       })
//       .then(function (docRef) {
//         console.log("Document written with ID: ", docRef.id);
//         div.setAttribute("data-id", docRef.id);
//       })
//       .catch(function (error) {
//         console.error("Error adding document: ", error);
//       });

//     /////----------------------------------------------firebase above
//     console.log("There are currently: " + myLibrary.length + " books: ");
//     console.log(myLibrary);
//     author.value = "";
//     title.value = "";
//     pages.value = "";
//     checkit.checked = "";
//   }
// });

// container.addEventListener("click", (k) => {
//   k.stopPropagation();
//   const par = k.target.parentElement;
//   let code = k.target.parentElement.getAttribute("data-id");

//   if (k.target.classList == "delete") {
//     db.collection("books").doc(code).delete();
//     container.removeChild(par);
//     myLibrary = myLibrary.filter((k) => k.title !== par.id);
//     console.log("Deleting " + par.id);
//     console.log("data-id " + code);
//     console.log(myLibrary);
//   } else if (k.target.classList == "toggle") {
//     myLibrary
//       .filter((k) => k.title == par.id)
//       .map((k) => {
//         if (k.read == true) {
//           console.log("data-id " + code);
//           db.collection("books").doc(code).update({ read: false });
//           k.read = false;
//         } else {
//           console.log("data-id " + code);
//           db.collection("books").doc(code).update({ read: true });
//           k.read = true;
//         }
//       });

//     console.log(myLibrary);
//   }
// });

// const search = document.getElementById("filter");
// const itemList = document.getElementById("items");

// const filterItems = (e) => {
//   //convert to lowercase
//   let text = e.target.value.toLowerCase();
//   //get list
//   let items = itemList.getElementsByTagName("div");
//   console.log(text);
//   //conversion to an array
//   Array.from(items).forEach(function (item) {
//     let itemName = item.firstChild.textContent;
//     console.log(itemName);
//     if (itemName.toLowerCase().indexOf(text) != -1) {
//       item.style.display = "block";
//     } else {
//       item.style.display = "none";
//     }
//   });
// };

// search.addEventListener("keyup", filterItems);
