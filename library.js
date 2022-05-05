let myLibrary = [];
const BASE_URL = 'https://openlibrary.org';
const READ_COLOUR = '#b0ddf5';
const UNREAD_COLOUR = '#ACECA1';

// UI declarations
const addBookButton = document.querySelector('.add-button');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const content = document.querySelector('.content');
const modal = document.querySelector('.modal');
const modalForm = document.querySelector('.modal-form');
const form = document.querySelector('.book-form');
const deleteAllButton = document.querySelector('.delete-all-button');
const randomBook = document.querySelector('.random-book');

const openModal = function openModal() { modal.style.display = 'flex'; };
const closeModal = function closeModal() { modal.style.display = 'none'; };
const stopBubbling = function stopBubbling(e) { e.stopPropagation(); };
const constructUrl = (baseUrl, path) => `${baseUrl}${path}.json`;
const generateRandomNumber = () => Math.floor(Math.random() * 1000000 + 35000);

function changeBookStyle(e) {
  const bookToChange = e.target.parentNode.parentNode.parentNode.className;
  const bookToChangeId = bookToChange.split(' ')[1];
  const book = myLibrary.find(
    (libraryBook) => libraryBook.bookNumber === parseInt(bookToChangeId, 10),
  );
  book.changeStyle();
}

function deleteBook(e) {
  const cardClass = e.target.parentElement.className.split(' ')[1];
  const cardToDelete = document.querySelector(`[class="bookCard ${cardClass}"`);
  myLibrary = myLibrary.filter((book) => book.bookNumber !== parseInt(cardClass, 10));
  cardToDelete.remove();
}

const bookFactory = (title, author, read = false) => {
  const bookNumber = Math.floor(Math.random() * 10000);
  const changeStyle = function changeStyle() {
    // eslint-disable-next-line no-param-reassign
    read = !read;
    const bookCard = document.querySelector(`[class="bookCard ${bookNumber}"]`);
    if (read) {
      bookCard.style.backgroundColor = READ_COLOUR;
    } else {
      bookCard.style.backgroundColor = UNREAD_COLOUR;
    }
  };
  return {
    title, author, read, bookNumber, changeStyle,
  };
};

const bookCardContainerFactory = (bookNumber) => {
  const bookCard = document.createElement('div');
  bookCard.classList.add('bookCard');
  bookCard.classList.add(bookNumber);
  return { bookCard };
};

const bookCardTitleFactory = (title) => {
  const bookCardTitleDiv = document.createElement('div');
  bookCardTitleDiv.classList.add('bookCard-title');
  const bookCardTitleLabel = document.createElement('div');
  const bookCardTitleText = document.createElement('span');
  bookCardTitleLabel.textContent = 'Title: ';
  bookCardTitleLabel.style.display = 'inline-block';
  bookCardTitleText.textContent = title;
  bookCardTitleDiv.appendChild(bookCardTitleLabel);
  bookCardTitleDiv.appendChild(bookCardTitleText);
  return { bookCardTitleDiv };
};

const bookCardAuthorFactory = (author) => {
  const bookCardAuthorSection = document.createElement('div');
  bookCardAuthorSection.classList.add('bookCard-author');
  const bookCardAuthorLabel = document.createElement('div');
  const bookCardAuthorText = document.createElement('span');
  bookCardAuthorLabel.textContent = 'Author: ';
  bookCardAuthorLabel.style.display = 'inline-block';
  bookCardAuthorText.textContent = author;
  bookCardAuthorSection.appendChild(bookCardAuthorLabel);
  bookCardAuthorSection.appendChild(bookCardAuthorText);
  return { bookCardAuthorDiv: bookCardAuthorSection };
};

const deleteCardButtonFactory = () => {
  const deleteButtonDiv = document.createElement('div');
  deleteButtonDiv.classList.add('close');
  deleteButtonDiv.addEventListener('click', deleteBook);
  return { deleteButtonDiv };
};

const readSwitchFactory = () => {
  const readSwitchLabel = document.createElement('label');
  readSwitchLabel.setAttribute('for', 'read-switch');
  readSwitchLabel.textContent = 'Mark As Read:';
  readSwitchLabel.classList.add('read-switch-label');

  const readSwitch = document.createElement('label');
  readSwitch.classList.add('switch');
  readSwitch.addEventListener('change', changeBookStyle);

  const checkBoxInput = document.createElement('input');
  checkBoxInput.setAttribute('type', 'checkbox');
  checkBoxInput.setAttribute('id', 'read-switch');

  const slider = document.createElement('span');
  slider.classList.add('slider', 'round');
  readSwitch.appendChild(checkBoxInput);
  readSwitch.appendChild(slider);

  const switchDiv = document.createElement('div');
  switchDiv.classList.add('switch-container');
  switchDiv.appendChild(readSwitchLabel);
  switchDiv.appendChild(readSwitch);

  return { switchDiv };
};

const bookCardFactory = ({
  title, author, read, bookNumber,
}) => {
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

  return { bookCardContainer };
};

const createBookCard = function createBookCard(book) {
  // skips creating a new book card for books already in the contents section
  if (document.querySelector(`[class="bookCard ${book.bookNumber}"`)) { return true; }
  const bookCard = bookCardFactory(book);
  content.appendChild(bookCard.bookCardContainer.bookCard);
  return true;
};

// create book "cards" for every book in myLibrary
const updateBooks = function updateBooks() {
  myLibrary.forEach(((book) => createBookCard(book)));
};

const addBookToLibrary = function addBookToLibrary(e) {
  e.preventDefault();
  const newBook = bookFactory(titleInput.value, authorInput.value);
  myLibrary.push(newBook);
  titleInput.value = '';
  authorInput.value = '';
  updateBooks();
  closeModal();
};

async function getResponse(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const responseJson = await response.json();

    // occasionally the book's information will be located on
    // a different page so we just have to visit that page
    if (responseJson.type.key === '/type/redirect') {
      return getResponse(`https://openlibrary.org${responseJson.location}.json`);
    }
    return responseJson;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBookAuthor(authorUrl) {
  try {
    const response = await fetch(authorUrl, { mode: 'cors' });
    const responseJson = await response.json();
    return responseJson.name;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRandomBookInfo() {
  const worksPath = `/works/OL${generateRandomNumber()}W`;
  const worksUrl = constructUrl(BASE_URL, worksPath);
  const response = await getResponse(worksUrl);
  const authorPath = response.authors[0].author.key;
  const authorUrl = constructUrl(BASE_URL, authorPath);
  const bookTitle = response.title;
  const bookAuthor = await getBookAuthor(authorUrl);
  return { bookTitle, bookAuthor };
}

const createRandomBook = async function createRandomBook() {
  const { bookTitle, bookAuthor } = await getRandomBookInfo();
  const newBook = bookFactory(bookTitle, bookAuthor);
  myLibrary.push(newBook);
  updateBooks();
};

function deleteAllBooks() {
  myLibrary.length = 0;
  const books = content.childNodes;
  books.forEach((book) => { book.remove(); });
  updateBooks();
}

// event listeners
modal.addEventListener('click', closeModal);
modalForm.addEventListener('click', stopBubbling);
addBookButton.addEventListener('click', openModal);
form.addEventListener('submit', addBookToLibrary);
deleteAllButton.addEventListener('click', deleteAllBooks);
randomBook.addEventListener('click', createRandomBook);

myLibrary.push(bookFactory('Oryx and Crake', 'Margaret Atwood'));
updateBooks();
createRandomBook();
