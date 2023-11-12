const books = []
const STORAGE_KEY = "BOOKSHELF"
const SAVED_EVENT = "save-book"
const RENDER_EVENT = "save-books"

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage")
        return false
    }
    return true
}

const generateId = () => {
    return +new Date()
}

const generateBooks = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year:parseInt(year),
        isComplete
    }
}

const dataFromStorage = () => {
    const booksStorage = localStorage.getItem(STORAGE_KEY);
    let dataBooks = JSON.parse(booksStorage);

    if (dataBooks !== null) for (let data of dataBooks) books.push(data)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const creatBookHandler = (bookStructure) => {
    const titleBook = document.createElement("h2")
    titleBook.innerText = `Judul : ${bookStructure.title}`

    const authorBook = document.createElement("p")
    authorBook.innerText = `Penulis : ${bookStructure.author}`

    const yearBook = document.createElement("p")
    yearBook.innerText = `Tahun : ${bookStructure.year}`

    const container = document.createElement("articel")
    container.classList.add("book_item")
    container.setAttribute("id", `book-${bookStructure.id}`)
    container.append(titleBook, authorBook, yearBook)

    const alert = document.getElementById("alert-bs")

    const undoBtn = document.createElement("button")
    undoBtn.classList.toggle("green-button")
    undoBtn.setAttribute("id", "button-undo")

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("red-button")
    trashBtn.setAttribute("id", "button-trash")

    if (bookStructure.isComplete) {
        undoBtn.innerText = "Belum Selesai Dibaca"
        undoBtn.addEventListener("click", () => {
            undoBookComplete(bookStructure.id)
            alert.innerText = "Buku Belum Selesai Dibaca"
        })

        trashBtn.innerText = "Hapus buku"
        trashBtn.addEventListener("click", () => {
            removeBookComplete(bookStructure.id)
            alert.innerText = "Buku Berhasil Dihapus"
        })

        container.append(undoBtn, trashBtn)
    } else {
        undoBtn.innerText = "Selesai Dibaca"
        undoBtn.addEventListener("click", () => {
            addBookComplete(bookStructure.id)
            alert.innerText = "Buku Selesai Dibaca"
        })

        trashBtn.innerText = "Hapus buku"
        trashBtn.addEventListener("click", () => {
            removeBookComplete(bookStructure.id)
            alert.innerText = "Buku Berhasil Dihapus"
        })
        container.append(undoBtn, trashBtn)
    }
    return container
}
const addBookHandler= () => {
    const titleBook = document.getElementById("inputBookTitle").value
    const authorBook = document.getElementById("inputBookAuthor").value
    const yearBook = document.getElementById("inputBookYear").value
    const isComplete = document.getElementById("inputBookIsComplete").checked

    const generateID = generateId()
    const bookStructure = generateBooks(generateID, titleBook, authorBook, yearBook, isComplete)
    books.push(bookStructure)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBookHandler()
    
}

const saveBookHandler = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const addBookComplete = (bookId) => {
    const bookSelect = findBooks(bookId)

    if (bookSelect == null) return

    bookSelect.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBookHandler()
}

const undoBookComplete = (bookId) => {
    const bookSelect = findBooks(bookId)
    if (bookSelect == null) return

    bookSelect.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBookHandler()
}

const removeBookComplete = (bookId) => {
    const bookSelect = findIndex(bookId)
    if (bookSelect === -1) return

    books.splice(bookSelect, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBookHandler()
}

const findBooks = (bookId) => {
    for (const book of books) {
        if (book.id === bookId) return book
    }
    return null
}

const findIndex = (bookId) => {
    for (const i in books) {
        if (books[i].id === bookId) return i
    }
    return -1
}

const checkbox = document.getElementById("inputBookIsComplete")
const span = document.querySelector("span")
checkbox.addEventListener("change", () => {
    checkbox.checked ? span.innerText = "Selesai Dibaca" : span.innerText = "Belum Selesai Dibaca"
})

const searchBooks = document.getElementById("searchBook")
searchBooks.addEventListener("click", (e) => {
    e.preventDefault()
    const searchBook = document.getElementById("searchBookTitle").value.toLowerCase()
    const listBooks = document.querySelectorAll(".book_item > h2")
    for (const book of listBooks) {
        book.innerText.toLowerCase().includes(searchBook) ? book.parentElement.style.display = "block" : book.parentElement.style.display = "none"
    }
})

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
    let alertBook = document.getElementById("alert-bs")
    setTimeout(() => {
        alertBook.classList.toggle("visually-hidden")
    }, 500)
    alertBook.classList.toggle("visually-hidden")

})

document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookList = document.getElementById("incompleteBookshelfList")
    incompleteBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList")
    completedBookList.innerHTML = "";

    for (const book of books) {
        const creatBook = creatBookHandler(book)
        !book.isComplete ? incompleteBookList.append(creatBook) : completedBookList.append(creatBook)
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const submit = document.getElementById("inputBook");
    submit.addEventListener("submit", (e) => {
        e.preventDefault();
        addBookHandler();
        
    });
    if (isStorageExist()) dataFromStorage();
})