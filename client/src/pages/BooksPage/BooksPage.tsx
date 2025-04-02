import BookCard from "@/entities/book/ui/ProductCard/BookCard";
import { useAppSelector } from "@/shared/lib/reduxHooks";
;
import { Box, Paper } from "@mui/material";
import React from "react";

export function BooksPage(): React.JSX.Element {

  const books = useAppSelector((state) => state.books.likedUsersBooks);

  return (
    <Paper elevation={0}>
      <h2>Favourite</h2>
      <Box
        mt={1}
        py={2}
        px={2}
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
      >
        {books.map((el) => (
          <Box p={1} key={el.id}>
            <BookCard book={el} 
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
