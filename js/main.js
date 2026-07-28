const exploreBtn = document.getElementById("explore-btn");
const categoryCards = document.querySelectorAll(".categoryCard");
const searchInput = document.querySelector(".searchInput");
const searchIcon = document.querySelector(".searchBox i");


async function fetchBooks(query) {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    const data = await response.json();

 return data.docs.filter(book =>
    book.title &&
    book.title.length <= 18 
);
}

// Render Books 
function renderBooks(books, container) {
    container.innerHTML = "";
    const booksWithCover = books.filter(book => book.cover_i);
    booksWithCover.map((book) => {
        const title = book.title;
        const author = book.author_name ? book.author_name[0] : "Unkown Author";
        const coverId = book.cover_i;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "https://via.placeholder.com/150x220?text=No+Cover";

        const card = `
        <div class="bookCard">

        <img src=${coverUrl} alt=${title}/>
        <h4>${title}</h4>
        <p>${author}</p>
        </div>
        
        `
        container.innerHTML += card;
    });


}

// Fetch by subject
async function fetchBySubject(subject) {
    const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=40`);
    const data = await response.json();

   const formattedBooks = data.works
    .map(work => ({
        title: work.title,
        author_name: work.authors ? [work.authors[0].name] : null,
        cover_i: work.cover_id
    }))
    .filter(book =>
        book.author_name &&
        !book.author_name.some(author =>
            author.toLowerCase().includes("charlotte perkins gilman")
        )
    );
    return formattedBooks;
}
async function loadFeaturedBooks() {

    const books = await fetchBooks("computer programming");
    const container = document.getElementById("books-container");
    if (!container) return;
    renderBooks(books, container);

}
loadFeaturedBooks();

categoryCards.forEach((categoryCard)=>{
    categoryCard.addEventListener("click",async ()=>{
        const subject = categoryCard.getAttribute("data-category").replace(/ /g,"_");
        const books = await fetchBySubject(subject);
        const container = document.getElementById("booksContainer");

        renderBooks(books,container)
    });
});

async function search() {
    const query = searchInput.value.trim();

    if(query === ""){
        return;
    }
    
    const books = await fetchBooks(query);
    const container = document.getElementById("booksContainer");

    if(!container){
        return;
    }
    renderBooks(books,container);
}

if(searchIcon){
    searchIcon.addEventListener("click",search);
}

if(searchInput){
    searchInput.addEventListener("keydown",(event)=>{
        if(event.key === "Enter"){
            search();
        }
    })
}

exploreBtn.addEventListener("click",()=>{
    window.location.href = "../pages/explore.html";
})