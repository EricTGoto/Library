let myLibrary = [];

// UI declarations
const submitBookButton = document.querySelector(".submit-button")
const addBookButton = document.querySelector(".add-button");
const body = document.querySelector("body");
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages')
const titleLabel = document.querySelector('title-label');
const content = document.querySelector('.content');
const modal = document.querySelector(".modal")
const modalForm = document.querySelector(".modal-form");
const inputs = document.querySelectorAll('input');
const form = document.querySelector('.book-form');

modal.addEventListener("click", closeModal);
modalForm.addEventListener("click", stopBubbling);
addBookButton.addEventListener("click", openModal);
form.addEventListener("submit", addBookToLibrary);

function stopBubbling(e) {
    e.stopPropagation();
}

function closeModal() {
    modal.style.display = "none";
}

function Book(title, author, read=false) {
    this.title = title;
    this.author = author;
    this.read = read;
    this.bookNumber =  Math.floor(Math.random() * 10000);
}

function addBookToLibrary(e) {
    e.preventDefault();
    const newBook = new Book(titleInput.value, authorInput.value);
    myLibrary.push(newBook);
    titleInput.value = "";
    authorInput.value = "";
    updateBooks()
    closeModal();
}

function updateBooks() {
    // create book "cards" for every book in myLibrary
    
    myLibrary.forEach(book => {

        if (document.querySelector(`[class="bookCard ${book.bookNumber}"`)) {return true};
        let bookCard = document.createElement("div");
        bookCard.classList.add("bookCard");
        bookCard.classList.add(book.bookNumber)
        let bookCardTitle = document.createElement("div");
        bookCardTitle.textContent = `Title: ${book.title}`;
        let bookCardAuthor = document.createElement("div");
        bookCardAuthor.textContent = `Author: ${book.author}`
        let bookCardDeleteButton = document.createElement("button")
        bookCardDeleteButton.textContent = "X";
        bookCardDeleteButton.addEventListener("click", deleteBook)
        bookCard.appendChild(bookCardTitle);
        bookCard.appendChild(bookCardAuthor);
        bookCard.appendChild(bookCardDeleteButton);
        content.appendChild(bookCard);
    });
    
}

function deleteBook(e) {
    console.log(e.target.parentElement.className)
    const cardClass = e.target.parentElement.className.split(" ")[1];
    const cardToDelete = document.querySelector(`[class="bookCard ${cardClass}"`);
    myLibrary.filter(book => book.bookNumber == cardClass);
    cardToDelete.remove();
}

function openModal() {
    modal.style.display = "flex";
}

myLibrary.push(new Book("weubb", "wiwi"))
myLibrary.push(new Book("we123123ubb", "wiw123123i"))
myLibrary.push(new Book("weubb", "wiwi"))
myLibrary.push(new Book("we123123ubb", "wiw123123i"))

updateBooks();