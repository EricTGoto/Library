let myLibrary = [];

function Book(title, author, read=false) {
    this.title = title;
    this.author = author;
    this.read = read;
    this.bookNumber = myLibrary.length;
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
    bookCard.textContent = `${book.title} ${book.author}`;
    body.appendChild(bookCard);
}

function deleteBook(book) {

}

const submitBookButton = document.querySelector(".submitButton")
const body = document.querySelector("body");
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author')
submitBookButton.addEventListener("click", addBookToLibrary);