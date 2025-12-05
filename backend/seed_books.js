const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Uses native fetch in Node 18+. Node 24 has global fetch.
const DATA_DIR = path.join(__dirname, 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

async function seed(target = 200) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  let books = [];
  if (fs.existsSync(BOOKS_FILE)) {
    try {
      books = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8')) || [];
    } catch (e) {
      console.warn('Existing books.json could not be parsed, starting fresh');
      books = [];
    }
  }

  console.log(`Starting seed. Already have ${books.length} books.`);

  let page = 1;
  while (books.length < target) {
    const url = `https://gutendex.com/books?page=${page}`;
    console.log('Fetching', url);
    const data = await fetchJson(url);
    if (!data || !data.results || data.results.length === 0) break;

    for (const item of data.results) {
      if (books.length >= target) break;

      // prefer text/plain or text/plain; charset=utf-8
      const formats = item.formats || {};
      const textUrls = Object.entries(formats).filter(([k]) => /text\/plain/.test(k));
      const textUrl = textUrls.length ? formats[textUrls[0][0]] : null;
      if (!textUrl) {
        // skip books without plain text
        continue;
      }

      const title = item.title || 'Untitled';
      const author = (item.authors && item.authors[0] && item.authors[0].name) || 'Unknown';
      const subjects = item.subjects || [];
      const genre = subjects[0] || (item.bookshelves && item.bookshelves[0]) || 'Fiction';
      const cover = formats['image/jpeg'] || formats['image/jpg'] || null;

      try {
        console.log('Fetching text for', title);
        const content = await fetchText(textUrl);

        const newBook = {
          id: uuidv4(),
          title,
          author,
          year: 1900,
          genre,
          coverImage: cover,
          content: content.slice(0, 2000000), // limit to 2MB per book to avoid huge files
          rating: 0,
          createdAt: new Date().toISOString(),
          favorites: [],
          readBy: []
        };

        books.push(newBook);
        console.log(`Added: ${title} (${books.length}/${target})`);
      } catch (err) {
        console.warn('Failed to fetch text for', title, err.message);
        continue;
      }
    }

    if (!data.next) break;
    page += 1;
  }

  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
  console.log(`Seeding complete. Wrote ${books.length} books to ${BOOKS_FILE}`);
}

seed(220).catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
