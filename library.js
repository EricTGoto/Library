let myLibrary = [];

function Book(title, author, read=false) {
    this.title = title;
    this.author = author;
    this.read = read;
    this.bookNumber = Math.random() * 10000;
}

function addBookToLibrary(e) {
    e.preventDefault();
    const newBook = new Book(titleInput.value, authorInput.value);
    myLibrary.push(newBook);
    titleInput.value = "";
    authorInput.value = "";
    displayBook(newBook);
}

function displayBook(book) {
    // create book "cards" for every book in myLibrary
    const bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    
    const bookCardTitle = document.createElement("div");
    bookCardTitle.textContent = `Title: ${book.title}`;
    const bookCardAuthor = document.createElement("div");
    bookCardAuthor.textContent = `Author: ${book.author}`
    const bookCardDeleteButton = document.createElement("button")
    bookCardDeleteButton.textContent = "X";
    
    bookCard.appendChild(bookCardTitle);
    bookCard.appendChild(bookCardAuthor);
    bookCard.appendChild(bookCardDeleteButton);
    content.appendChild(bookCard);
}

function deleteBook(book) {

}

const submitBookButton = document.querySelector(".submitButton")
const body = document.querySelector("body");
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const content = document.querySelector('.content');
submitBookButton.addEventListener("click", addBookToLibrary);