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
const randomBook = document.querySelector('.random-book');

const createRandomBook = async function() {
    const {bookTitle, bookAuthor} = await getRandomBookInfo();
    const newBook = bookFactory(bookTitle, bookAuthor);
    myLibrary.push(newBook);
    updateBooks();
}

// event listeners
modal.addEventListener("click", closeModal);
modalForm.addEventListener("click", stopBubbling);
addBookButton.addEventListener("click", openModal);
form.addEventListener("submit", addBookToLibrary);
deleteAllButton.addEventListener("click", deleteAllBooks);
randomBook.addEventListener("click", createRandomBook);

function changeBookStyle(e) {
    const bookToChange = e.target.parentNode.parentNode.parentNode.className;
    const bookToChangeId = bookToChange.split(" ")[1];
    const book = myLibrary.find(book => book.bookNumber === parseInt(bookToChangeId));
    book.changeStyle()
}

function stopBubbling(e) {
    e.stopPropagation();
}

function closeModal() {
    modal.style.display = "none";
}

const bookFactory = (title, author, read=false) => {
    const bookNumber = Math.floor(Math.random() * 10000);
    const changeStyle = function() {
        console.log("Change");
        read = !read;
        const bookCard = document.querySelector(`[class="bookCard ${bookNumber}"]`);
        if (read) {
            bookCard.style.backgroundColor = "#b0ddf5";
        } else {
            bookCard.style.backgroundColor  = "#96BE8C";
        }
    };
    return {title, author, read, bookNumber, changeStyle}
};

function addBookToLibrary(e) {
    e.preventDefault();
    const newBook = bookFactory(titleInput.value, authorInput.value);
    myLibrary.push(newBook);
    titleInput.value = "";
    authorInput.value = "";
    updateBooks()
    closeModal();
}

const bookCardFactory = ({title, author, read, bookNumber}) => {
    // compose parts of book
    const bookCardContainer = bookCardContainerFactory(bookNumber);
    const bookCardTitle = bookCardTitleFactory(title);
    const bookCardAuthor = bookCardAuthorFactory(author);
    const bookCardDeleteButton = deleteCardButtonFactory();
    const readSwitch = readSwitchFactory();

    bookCardContainer.bookCard.appendChild(bookCardTitle.bookCardTitleDiv);
    bookCardContainer.bookCard.appendChild(bookCardAuthor.bookCardAuthorDiv);
    bookCardContainer.bookCard.appendChild(bookCardDeleteButton.deleteButtonDiv);
    bookCardContainer.bookCard.appendChild(readSwitch.switchDiv);

    return {bookCardContainer}
};

const bookCardContainerFactory = (bookNumber) => {
    let bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    bookCard.classList.add(bookNumber)
    return {bookCard}
};

const bookCardTitleFactory = (title) => {
    let bookCardTitleDiv = document.createElement("div");
    bookCardTitleDiv.classList.add("bookCard-title")
    let bookCardTitleLabel = document.createElement("div");
    let bookCardTitleText = document.createElement("span");
    bookCardTitleLabel.textContent = "Title: ";
    bookCardTitleLabel.style.display = "inline-block";
    bookCardTitleText.textContent = title;
    bookCardTitleDiv.appendChild(bookCardTitleLabel);
    bookCardTitleDiv.appendChild(bookCardTitleText);
    return {bookCardTitleDiv}
};

const bookCardAuthorFactory = (author) => {
    let bookCardAuthorSection = document.createElement("div");
    bookCardAuthorSection.classList.add("bookCard-author")
    let bookCardAuthorLabel = document.createElement("div");
    let bookCardAuthorText = document.createElement("span");
    bookCardAuthorLabel.textContent = "Author: "
    bookCardAuthorLabel.style.display = "inline-block";
    bookCardAuthorText.textContent = author;
    bookCardAuthorSection.appendChild(bookCardAuthorLabel);
    bookCardAuthorSection.appendChild(bookCardAuthorText);
    return {bookCardAuthorDiv: bookCardAuthorSection}
};

const deleteCardButtonFactory = () => {
    let deleteButtonDiv = document.createElement("div")
    deleteButtonDiv.classList.add("close");
    deleteButtonDiv.addEventListener("click", deleteBook);
    return {deleteButtonDiv}
};

const readSwitchFactory = () => {
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

    return {switchDiv}
};

function updateBooks() {
    // create book "cards" for every book in myLibrary
    myLibrary.forEach(book => {
        // skips creating a new book card for books already in the contents section
        if (document.querySelector(`[class="bookCard ${book.bookNumber}"`)) {return true};
        const bookCard = bookCardFactory(book);
        content.appendChild(bookCard.bookCardContainer.bookCard);
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

const constructUrl = (baseUrl, path) => `${baseUrl}${path}.json`;



myLibrary.push(bookFactory("Oryx and Crake", "Margaret Atwood"));
updateBooks();

getRandomBookInfo();
createRandomBook();

async function getRandomBookInfo() {
    let baseUrl = "https://openlibrary.org";
    const worksPath = '/works/OL45883W';
    const url = constructUrl(baseUrl, worksPath);
    const response = await getResponse(url);
    const authorPath = response.authors[0].author.key;
    const authorUrl = constructUrl(baseUrl, authorPath);
    let bookTitle = response.title;
    let bookAuthor = await getBookAuthor(authorUrl);
    return {bookTitle, bookAuthor}
}

async function getResponse(url) {
    const response = fetch(url, {mode: "cors"})
    return responseJson = await response.then(function(response){
        return response.json()
    })
}

async function getBookAuthor(authorUrl) {
    const response = fetch(authorUrl, {mode: "cors"})
    const responseJson = await response.then(function(response) {
        return response.json()
    })
    return responseJson.name
}

