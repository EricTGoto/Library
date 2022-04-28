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
const deleteAllButton = document.querySelector('.delete-all-button');

// event listeners
modal.addEventListener("click", closeModal);
modalForm.addEventListener("click", stopBubbling);
addBookButton.addEventListener("click", openModal);
form.addEventListener("submit", addBookToLibrary);
deleteAllButton.addEventListener("click", deleteAllBooks);

function changeBookStyle(e) {
    console.log(e.target.parentNode.parentNode.parentNode.className);
    const bookToChange = e.target.parentNode.parentNode.parentNode.className;
    const bookToChangeId = bookToChange.split(" ")[1];
    console.log(bookToChangeId);
    const book = myLibrary.find(book => book.bookNumber === parseInt(bookToChangeId));
    book.changeStyle()
}

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

Book.prototype.changeStyle = function() {
    this.read = !this.read;
    const bookCard = document.querySelector(`[class="bookCard ${this.bookNumber}"]`)
    if (this.read) {
        bookCard.style.backgroundColor = "#b0ddf5";
    } else {
        bookCard.style.backgroundColor  = "#96BE8C"
    }
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
        // skips creating a new book card for books already in the contents section
        console.log(book.title);
        if (document.querySelector(`[class="bookCard ${book.bookNumber}"`)) {return true};
        let bookCard = document.createElement("div");
        bookCard.classList.add("bookCard");
        bookCard.classList.add(book.bookNumber)
        let bookCardTitleSection = document.createElement("div");
        bookCardTitleSection.classList.add("bookCard-title")
        let bookCardTitleLabel = document.createElement("div");
        let bookCardTitleText = document.createElement("span");
        bookCardTitleLabel.textContent = "Title: ";
        bookCardTitleLabel.style.display = "inline-block";
        bookCardTitleText.textContent = book.title;
        let bookCardAuthorSection = document.createElement("div");
        bookCardAuthorSection.classList.add("bookCard-author")
        let bookCardAuthorLabel = document.createElement("div");
        let bookCardAuthorText = document.createElement("span");
        bookCardAuthorLabel.textContent = "Author: "
        bookCardAuthorLabel.style.display = "inline-block";
        bookCardAuthorText.textContent = book.author;
        let bookCardDeleteButton = document.createElement("div")
        bookCardDeleteButton.classList.add("close");
        bookCardDeleteButton.addEventListener("click", deleteBook);

        let readSwitchLabel = document.createElement("label");
        readSwitchLabel.setAttribute("for", "read-switch");
        readSwitchLabel.textContent = "Mark As Read:";
        readSwitchLabel.classList.add("read-switch-label");

        let readSwitch = document.createElement("label");
        readSwitch.classList.add("switch");
        readSwitch.addEventListener("change", changeBookStyle);

        let checkBoxInput = document.createElement("input");
        checkBoxInput.setAttribute("type", "checkbox");
        checkBoxInput.setAttribute("id", "read-switch");

        let slider = document.createElement("span");
        slider.classList.add("slider", "round");
        readSwitch.appendChild(checkBoxInput);
        readSwitch.appendChild(slider);

        let switchDiv = document.createElement("div");
        switchDiv.classList.add("switch-container");
        switchDiv.appendChild(readSwitchLabel);
        switchDiv.appendChild(readSwitch);

        bookCardTitleSection.appendChild(bookCardTitleLabel);
        bookCardTitleSection.appendChild(bookCardTitleText);
        bookCardAuthorSection.appendChild(bookCardAuthorLabel);
        bookCardAuthorSection.appendChild(bookCardAuthorText);
        bookCard.appendChild(bookCardTitleSection);
        bookCard.appendChild(bookCardAuthorSection);
        bookCard.appendChild(bookCardDeleteButton);
        bookCard.appendChild(switchDiv);
        content.appendChild(bookCard);
    });
}

function deleteBook(e) {
    const cardClass = e.target.parentElement.className.split(" ")[1];
    const cardToDelete = document.querySelector(`[class="bookCard ${cardClass}"`);
    myLibrary = myLibrary.filter(book => book.bookNumber != parseInt(cardClass));
    cardToDelete.remove();
}

function deleteAllBooks() {
    myLibrary.length = 0
    const books = content.childNodes;
    books.forEach(book => { book.remove() });
    updateBooks();
}

function openModal() {
    modal.style.display = "flex";
}

myLibrary.push(new Book("Oryx and Crake", "Margaret Atwood"))
updateBooks();


