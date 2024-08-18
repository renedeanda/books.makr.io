'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Save, Sun, Moon, Star, BookmarkPlus, Share2, User, ShoppingCart, PlusCircle, Image, Trash2, ExternalLink, Copy, Check, Edit } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from './ThemeContext';
import { useToast } from "@/components/ui/use-toast";
import LinkedInCarouselExport from './LinkedInCarouselExport';
import ReactPaginate from 'react-paginate';

const BookRecommendationApp = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [readingLists, setReadingLists] = useState({ default: [] });
  const [currentList, setCurrentList] = useState('default');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const booksPerPage = 9;
  const [activeTab, setActiveTab] = useState('search');
  const maxPages = 3;
  const [selectedList, setSelectedList] = useState('');
  const [renameListDialog, setRenameListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [bookToAdd, setBookToAdd] = useState(null);

  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy", "Romance", "Thriller",
    "Horror", "Historical Fiction", "Biography", "Autobiography", "Memoir", "Poetry", "Drama",
    "Adventure", "Young Adult", "Children's", "Dystopian", "Humor", "Self-Help", "Travel",
    "True Crime", "Philosophy", "Psychology", "Science", "History", "Politics", "Art", "Music"
  ];

  useEffect(() => {
    const savedReadingLists = JSON.parse(localStorage.getItem('readingLists')) || { default: [] };
    setReadingLists(savedReadingLists);
  }, []);

  const fetchBooks = async (page = 0) => {
    let url = `https://openlibrary.org/search.json?q=${query}&limit=${booksPerPage}&offset=${page * booksPerPage}`;
    if (genre) {
      url += `&subject=${encodeURIComponent(genre)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setBooks(data.docs);
    setTotalPages(Math.min(maxPages, Math.ceil(data.numFound / booksPerPage)));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchBooks();
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    fetchBooks(selected);
  };

  const handleAddToReadingList = (book) => {
    setBookToAdd(book);
    setIsAddToListOpen(true);
  };

  const confirmAddToReadingList = () => {
    if (selectedList && bookToAdd) {
      const updatedLists = {
        ...readingLists,
        [selectedList]: [...(readingLists[selectedList] || []), bookToAdd]
      };
      setReadingLists(updatedLists);
      localStorage.setItem('readingLists', JSON.stringify(updatedLists));
      toast({
        title: "Book Added",
        description: (
          <div className="flex items-center">
            <Check className="mr-2 text-green-500" />
            <span>&quot;{bookToAdd.title}&quot; has been added to your &quot;{selectedList}&quot; reading list.</span>
          </div>
        ),
      });
      setSelectedList('');
      setIsAddToListOpen(false);
      setBookToAdd(null);
    }
  };

  const handleRemoveFromReadingList = (book) => {
    const updatedList = readingLists[currentList].filter(b => b.key !== book.key);
    const updatedLists = { ...readingLists, [currentList]: updatedList };
    setReadingLists(updatedLists);
    localStorage.setItem('readingLists', JSON.stringify(updatedLists));
    toast({
      title: "Book Removed",
      description: `"${book.title}" has been removed from your ${currentList} reading list.`,
    });
  };

  const handleCreateNewList = () => {
    const listName = prompt("Enter a name for the new reading list:");
    if (listName && !readingLists[listName]) {
      setReadingLists({ ...readingLists, [listName]: [] });
      setCurrentList(listName);
    }
  };

  const handleRenameList = () => {
    if (newListName && newListName !== currentList) {
      const updatedLists = { ...readingLists };
      updatedLists[newListName] = updatedLists[currentList];
      delete updatedLists[currentList];
      setReadingLists(updatedLists);
      setCurrentList(newListName);
      localStorage.setItem('readingLists', JSON.stringify(updatedLists));
      toast({
        title: "List Renamed",
        description: `"${currentList}" has been renamed to "${newListName}".`,
      });
      setRenameListDialog(false);
      setNewListName('');
    }
  };

  const filterBooks = (book) => {
    return (
      (!author || book.author_name?.includes(author)) &&
      (!yearFrom || book.first_publish_year >= parseInt(yearFrom)) &&
      (!yearTo || book.first_publish_year <= parseInt(yearTo))
    );
  };

  const handleShareReadingList = () => {
    const currentReadingList = readingLists[currentList] || [];
    const shareText = `Check out my "${currentList}" reading list:\n\n${currentReadingList.map(book => `- "${book.title}" by ${book.author_name?.[0] || 'Unknown'} (${book.first_publish_year || 'Unknown'})`).join('\n')}\n\nCreated with books.makr.io`;

    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Reading List Copied!",
        description: "A formatted version of your reading list has been copied to your clipboard. You can now paste and share it anywhere!",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy the reading list. Please try again.",
        variant: "destructive",
      });
    });
  };

  const AuthorSpotlight = ({ author }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full"><User className="mr-2" />Author Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{author}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Find more about this author:</p>
          <div className="flex space-x-2">
            <Button onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(author)}`, '_blank')}>
              Wikipedia
            </Button>
            <Button onClick={() => window.open(`https://www.goodreads.com/search?q=${encodeURIComponent(author)}`, '_blank')}>
              Goodreads
            </Button>
            <Button onClick={() => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(author)}`, '_blank')}>
              Perplexity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const BookAvailability = ({ book }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full"><ShoppingCart className="mr-2" />Where to Buy</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Where to find &quot;{book.title}&quot;</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <a href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author_name?.[0])}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            Search on Amazon
          </a>
          <a href={`https://www.barnesandnoble.com/s/${encodeURIComponent(book.title + ' ' + book.author_name?.[0])}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            Search on Barnes & Noble
          </a>
          <a href={`https://www.worldcat.org/search?q=${encodeURIComponent(book.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            Find in a library near you
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      <nav className="flex justify-between items-center mb-4">
        <a href="https://rede.io/?utm_source=books" className="font-bold hover:underline">
          Check out 📚 Rede.io for your daily tech newsletter!
        </a>
        <Button onClick={toggleTheme} variant="ghost">
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
      </nav>
      <div className="flex justify-center items-center p-6 flex-grow">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold">Book Recommendations</h1>
          <p className="text-xl mt-4">
            Crafted with 🧡 + 🤖 by <a href="https://renedeanda.com/?utm_source=books" className="text-amber-500 hover:underline">René DeAnda</a>
          </p>
        </header>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="flex-grow"
        />
        <Button type="submit"><Search className="mr-2" />Search</Button>
      </form>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Select onValueChange={setGenre}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(g => (
              <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Filter by author"
          className="w-[180px]"
        />

        <Input
          type="number"
          value={yearFrom}
          onChange={(e) => setYearFrom(e.target.value)}
          placeholder="Year from"
          className="w-[120px]"
        />

        <Input
          type="number"
          value={yearTo}
          onChange={(e) => setYearTo(e.target.value)}
          placeholder="Year to"
          className="w-[120px]"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="reading-list">Reading List</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={currentList} onValueChange={setCurrentList}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Reading List" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(readingLists).map(listName => (
                  <SelectItem key={listName} value={listName}>{listName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNewList}><PlusCircle className="mr-2" />New List</Button>
            <Dialog open={renameListDialog} onOpenChange={setRenameListDialog}>
              <DialogTrigger asChild>
                <Button variant="outline"><Edit className="mr-2" />Rename List</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename List</DialogTitle>
                </DialogHeader>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter new list name"
                />
                <DialogFooter>
                  <Button onClick={handleRenameList}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="search">
          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.filter(filterBooks).map((book) => (
                  <Card key={book.key} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                           alt={`Cover of ${book.title}`}
                          className="w-24 h-36 object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-book-cover.jpg' }}
                        />
                        <div>
                          <p className="line-clamp-2">Author: {book.author_name?.join(', ') || 'Unknown'}</p>
                          <p>First Published: {book.first_publish_year || 'Unknown'}</p>
                          <p className="line-clamp-2">Genre: {book.subject?.slice(0, 3).join(', ') || 'Unknown'}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button className="w-full" onClick={() => handleAddToReadingList(book)}>
                        <BookmarkPlus className="mr-2" /> Add to List
                      </Button>
                      <div className="flex gap-2 w-full">
                        <AuthorSpotlight author={book.author_name?.[0]} />
                        <BookAvailability book={book} />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                containerClassName={"pagination flex justify-center space-x-2 mt-4"}
                previousLinkClassName={"px-3 py-2 bg-blue-500 text-white rounded"}
                nextLinkClassName={"px-3 py-2 bg-blue-500 text-white rounded"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                activeClassName={"font-bold"}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl mb-4">No books found. Try a different search term.</p>
              <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            </div>
          )}
        </TabsContent>
        <TabsContent value="reading-list">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Current Reading List: {currentList}</h2>
            <div className="flex gap-2">
              <Button onClick={handleShareReadingList}>
                <Copy className="mr-2" /> Copy List
              </Button>
              <LinkedInCarouselExport readingList={readingLists[currentList] || []} listName={currentList} />
            </div>
          </div>
          {readingLists[currentList]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingLists[currentList].map((book) => (
                <Card key={book.key} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={`Cover of ${book.title}`}
                        className="w-24 h-36 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-book-cover.jpg' }}
                      />
                      <div>
                        <p className="line-clamp-2">Author: {book.author_name?.join(', ') || 'Unknown'}</p>
                        <p>First Published: {book.first_publish_year || 'Unknown'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button onClick={() => handleRemoveFromReadingList(book)} variant="destructive" className="w-full">
                      <Trash2 className="mr-2" /> Remove from List
                    </Button>
                    <div className="flex gap-2 w-full">
                      <AuthorSpotlight author={book.author_name?.[0]} />
                      <BookAvailability book={book} />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl mb-4">Your reading list is empty. Add some books!</p>
              <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isAddToListOpen} onOpenChange={setIsAddToListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add &quot;{bookToAdd?.title}&quot; to Reading List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Choose a reading list to add the book to:</p>
            <Select onValueChange={setSelectedList}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(readingLists).map(listName => (
                  <SelectItem key={listName} value={listName}>{listName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={confirmAddToReadingList} disabled={!selectedList}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p className="mt-4">
          Crafted with 🧡 + 🤖 by René
        </p>
      </footer>
    </div>
  );
};

export default BookRecommendationApp;