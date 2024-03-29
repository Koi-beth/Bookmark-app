const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = []; // Initialize an empty array to store bookmarks

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }

  if (!urlValue.match(regex)) {
    alert('Please provide a valid address');
    return false;
  }

  return true; // Return true if validation passes
}

// Delete Bookmark
function deleteBookmark(url) {
     bookmarks.forEach((bookmark, i) => {
if (bookmark.url === url) {
    bookmarks.splice(i, 1);
}
     });
    //  Update Bookmarks array in localStorage, re-populate DOM 
    localStorage.setItem('bookmarks', JSON.stringify(bookmark));
    fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
  e.preventDefault(); // Prevent default form submission behavior

  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return; // Exit the function if validation fails
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark); // Add the new bookmark to the array

  // Store the updated bookmarks array in local storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset(); // Clear the form fields
  websiteNameEl.focus();
}

// Build Bookmarks DOM
function buildBookmarks () {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark) => {
      const { name, url} = bookmark;
    //   Item
    const item = document.createElement('div');
    item.classList.add('item'); 
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url})`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/sfavicons.domain=${url}`);
    favicon.setAttribute('alt','Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href',`${url}`);
    link.setAttribute('target','_blank');
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
    });
}
//  Fetch Bookmarks
function fetchBookmarks () {
    // Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
        {
            name: 'Beth design',
            url: 'https://beth.design',
        },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
