
'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Save, Sun, Moon, Star, BookmarkPlus, Share2, User, ShoppingCart, PlusCircle, Image, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from './ThemeContext';
import { useToast } from "@/components/ui/use-toast"
import LinkedInCarouselExport from './LinkedInCarouselExport';
import ReactPaginate from 'react-paginate';

const BookRecommendationApp = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [readingLists, setReadingLists] = useState({default: []});
  const [currentList, setCurrentList] = useState('default');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const booksPerPage = 9;

  useEffect(() => {
    const savedReadingLists = JSON.parse(localStorage.getItem('readingLists')) || { default: [] };
    setReadingLists(savedReadingLists);
  }, []);

  const fetchBooks = async (page = 0) => {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=${booksPerPage}&offset=${page * booksPerPage}`);
    const data = await response.json();
    setBooks(data.docs);
    setTotalPages(Math.ceil(data.numFound / booksPerPage));
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
    const updatedLists = {
      ...readingLists,
      [currentList]: [...(readingLists[currentList] || []), book]
    };
    setReadingLists(updatedLists);
    localStorage.setItem('readingLists', JSON.stringify(updatedLists));
    toast({
      title: "Book Added",
      description: `"${book.title}" has been added to your ${currentList} reading list.`,
    });
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

  const filterBooks = (book) => {
    return (
      (!genre || book.subject?.includes(genre)) &&
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

  const fetchAuthorInfo = async (authorName) => {
    const response = await fetch(`https://openlibrary.org/search/authors.json?q=${authorName}`);
    const data = await response.json();
    if (data.docs.length > 0) {
      setSelectedAuthor(data.docs[0]);
    }
  };

  const AuthorSpotlight = ({ author }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><User className="mr-2" />Author Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{author}</DialogTitle>
        </DialogHeader>
        <div>
          {selectedAuthor ? (
            <>
              <p>Birth Date: {selectedAuthor.birth_date || 'Unknown'}</p>
              <p>Top Work: {selectedAuthor.top_work || 'N/A'}</p>
              <p>Work Count: {selectedAuthor.work_count || 'Unknown'}</p>
            </>
          ) : (
            <p>Loading author information...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const BookAvailability = ({ book }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><ShoppingCart className="mr-2" />Where to Buy</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Where to find "{book.title}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <a href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author_name?.[0])}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">Search on Amazon</a>
          <a href={`https://www.barnesandnoble.com/s/${encodeURIComponent(book.title + ' ' + book.author_name?.[0])}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">Search on Barnes & Noble</a>
          <a href={`https://www.worldcat.org/search?q=${encodeURIComponent(book.title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">Find in a library near you</a>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      <nav className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Book Recommendations</h1>
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
          <Button onClick={handleShareReadingList}>
            <Share2 className="mr-2" /> Share List
          </Button>
          <LinkedInCarouselExport readingList={readingLists[currentList] || []} listName={currentList} />
          <Button onClick={toggleTheme} variant="ghost">
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
      </nav>
      
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
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="science-fiction">Science Fiction</SelectItem>
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

      <Tabs defaultValue="search" className="w-full">
        <TabsList>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="reading-list">Reading List</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.filter(filterBooks).map((book) => (
                  <Card key={book.key} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{book.title}</CardTitle>
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
                          <p>Author: {book.author_name?.join(', ') || 'Unknown'}</p>
                          <p>First Published: {book.first_publish_year || 'Unknown'}</p>
                          <p>Genre: {book.subject?.slice(0, 3).join(', ') || 'Unknown'}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2 justify-between">
                      <Button onClick={() => handleAddToReadingList(book)}>
                        <BookmarkPlus className="mr-2" /> Add to List
                      </Button>
                      <AuthorSpotlight author={book.author_name?.[0]} />
                      <BookAvailability book={book} />
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
          <h2 className="text-2xl font-bold mb-4">Current Reading List: {currentList}</h2>
          {readingLists[currentList]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingLists[currentList].map((book) => (
                <Card key={book.key} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={`Cover of ${book.title}`}
                        className="w-24 h-36 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-book-cover.jpg' }}
                      />
                      <div>
                        <p>Author: {book.author_name?.join(', ') || 'Unknown'}</p>
                        <p>First Published: {book.first_publish_year || 'Unknown'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleRemoveFromReadingList(book)} variant="destructive">
                      <Trash2 className="mr-2" /> Remove from List
                    </Button>
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
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        Created with <a href="https://books.makr.io" className="underline">books.makr.io</a>
      </footer>
    </div>
  );
};

export default BookRecommendationApp;
