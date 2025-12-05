import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { BookLibrary } from './components/BookLibrary';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [books, setBooks] = useState([]);

  // Initialize with mock data
  useEffect(() => {
    const mockBooks = [
      {
        id: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        year: 1960,
        genre: 'Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence set in the American South during the 1930s. Through the eyes of young Scout Finch, we witness her father Atticus defend a black man falsely accused of a terrible crime.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
        rating: 4.8,
        isFavorite: true,
        pages: 324,
        isbn: '978-0-06-112008-4'
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        year: 1949,
        genre: 'Dystopian',
        description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism. Winston Smith struggles against the oppressive rule of Big Brother in a world where reality is constantly being rewritten.',
        coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
        rating: 4.7,
        isFavorite: false,
        pages: 328,
        isbn: '978-0-452-28423-4'
      },
      {
        id: '3',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        year: 1813,
        genre: 'Romance',
        description: 'A romantic novel of manners set in Georgian England. Elizabeth Bennet navigates issues of morality, education, and marriage in the society of the landed gentry.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
        rating: 4.6,
        isFavorite: true,
        pages: 432,
        isbn: '978-0-14-143951-8'
      },
      {
        id: '4',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        year: 1925,
        genre: 'Fiction',
        description: 'A critique of the American Dream set in the Jazz Age. The mysterious millionaire Jay Gatsby and his obsession with the beautiful former debutante Daisy Buchanan.',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        rating: 4.4,
        isFavorite: false,
        pages: 180,
        isbn: '978-0-7432-7356-5'
      },
      {
        id: '5',
        title: 'Animal Farm',
        author: 'George Orwell',
        year: 1945,
        genre: 'Political Satire',
        description: 'An allegorical novella about Soviet totalitarianism. A group of farm animals rebel against their human farmer, hoping to create a society where animals can be equal, free, and happy.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80',
        rating: 4.5,
        isFavorite: false,
        pages: 112,
        isbn: '978-0-452-28424-1'
      },
      {
        id: '6',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        year: 1951,
        genre: 'Fiction',
        description: 'A story of teenage rebellion and alienation. Holden Caulfield narrates his experiences in New York City after being expelled from prep school.',
        coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
        rating: 4.3,
        isFavorite: true,
        pages: 277,
        isbn: '978-0-316-76948-0'
      },
      {
        id: '7',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        year: 1937,
        genre: 'Fantasy',
        description: 'A fantasy novel about the quest of home-loving Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.',
        coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&q=80',
        rating: 4.9,
        isFavorite: true,
        pages: 310,
        isbn: '978-0-547-92822-7'
      },
      {
        id: '8',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        year: 1997,
        genre: 'Fantasy',
        description: 'The first novel in the Harry Potter series follows Harry\'s first year at Hogwarts School of Witchcraft and Wizardry as he discovers his magical heritage.',
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
        rating: 4.8,
        isFavorite: true,
        pages: 223,
        isbn: '978-0-439-70818-8'
      },
      {
        id: '9',
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        year: 2003,
        genre: 'Mystery',
        description: 'A mystery thriller that follows symbologist Robert Langdon and cryptologist Sophie Neveu as they investigate a murder in Paris.',
        coverImage: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&q=80',
        rating: 4.2,
        isFavorite: false,
        pages: 454,
        isbn: '978-0-307-47492-1'
      }
    ];
    setBooks(mockBooks);
  }, []);

  const handleLogin = (email, password) => {
    // Mock login - in real app, validate against backend
    setCurrentUser({ email, name: email.split('@')[0] });
    setCurrentPage('library');
  };

  const handleSignup = (name, email, password) => {
    // Mock signup - in real app, create user in backend
    setCurrentUser({ email, name });
    setCurrentPage('library');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleAddBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString()
    };
    setBooks([...books, newBook]);
  };

  const handleUpdateBook = (id, updatedBook) => {
    setBooks(books.map(book => 
      book.id === id ? { ...updatedBook, id } : book
    ));
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleToggleFavorite = (id) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
    ));
  };

  const handleRateBook = (id, rating) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, rating } : book
    ));
  };

  if (!currentUser) {
    if (currentPage === 'login') {
      return (
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentPage('signup')}
        />
      );
    } else {
      return (
        <SignupPage 
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      );
    }
  }

  return (
    <BookLibrary
      user={currentUser}
      books={books}
      onLogout={handleLogout}
      onAddBook={handleAddBook}
      onUpdateBook={handleUpdateBook}
      onDeleteBook={handleDeleteBook}
      onToggleFavorite={handleToggleFavorite}
      onRateBook={handleRateBook}
    />
  );
}
