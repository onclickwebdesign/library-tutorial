require('../css/styles.css');
const $ = require('jquery');
import 'bootstrap/dist/js/bootstrap.bundle';
const Utilities = require('./utilities');

// Remove any visible alerts on page load
window.onload = () => {
    Utilities.removeAlert();
};

const removeBook = async elem => {
    const id = elem.getAttribute('data-bookid');

    try {
        const result = await fetch(`/books/deletebook/${id}`, { method: 'DELETE' });
        const jsonResponse = await result.json();
        console.log(jsonResponse.msg);
        Utilities.removeBookModal.modal('hide');
    } catch (err) {
        console.error('Fetch error: ', err);
    }
};

const setDataAttribute = elem => {
    const id = elem.getAttribute('data-bookid');
    document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};

$('#search-books-submit').on('click', event => {
    event.preventDefault(); // prevent form from automatically submitting

    if (Utilities.bookSearch.val().trim()) {
        Utilities.searchBooksForm.submit();
    } else {
        Utilities.showAlert('danger', 'Please enter a search term first.');
    }
});

$('#books-table').on('click', '.remove-book', event => {
    setDataAttribute(event.currentTarget);
});

$('#book-cards-list').on('click', '.remove-book', event => {
    setDataAttribute(event.currentTarget);
});

// this event triggered from "removeBookModal" yes button
$('#removeBookConfirm').on('click', event => {
    removeBook(event.currentTarget);
});