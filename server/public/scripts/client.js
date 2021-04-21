$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-book', deleteBookHandler);
  $('#bookShelf').on('click', '.edit-read', readBookHandler);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();
  
  for(let i = 0; i < books.length; i += 1) {
      let newRow = $(`
      <tr>
        <td>${books[i].title}</td>
        <td>${books[i].author}</td>
        <td>${books[i].isRead}</td>
        <td>
          <button type="button" class="delete-book" data-id="${books[i].id}">
            Delete Book
          </button>
          <button type="button" class="edit-read" data-id="${books[i].id}">
            Mark as Read
          </button>
        </td>
      </tr>
    `)   
    // For each book, append a new row to our table
    $('#bookShelf').append(newRow);
  }
}

function readBookHandler(){
  markAsRead( $(this).data("id"), "read" );
}

function markAsRead(bookId, isRead){
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    data: {
      isRead: isRead
    }
  })
  .then(response => {
    refreshBooks();
  })
  .catch(error => {
    console.log('error on book mark as read.', error);
  })
}

function deleteBookHandler(){
  deleteBook( $(this).data("id") );
}

function deleteBook(bookId) {
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  })
  .then(response => {
    console.log('Deleted it, WOOT!');
    refreshBooks();
  })
  .catch(error => {
    alert(`Error on delete`, error);
  })
}