import BookCard from "@/entities/book/ui/ProductCard/BookCard";
import { changeSort } from "@/features/bookSlice/slice";
import {  useAppDispatch, useAppSelector } from "@/shared/lib/reduxHooks";
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import React from "react";

export default function BookList(): React.JSX.Element {
  const books = useAppSelector((state) => state.books.books);
  const { key, order } = useAppSelector((store) => store.books.sort);
  const dispatch = useAppDispatch();

  return (
    <Paper elevation={0}>
         <ButtonGroup>
            <Button
              onClick={() => {
                dispatch(changeSort('order'));
              }}
              variant={key === 'order' ? 'secondary' : 'outline-secondary'}
            >
              По порядку добавления {key === 'order' && (order === 'asc' ? '1-9' : '9-1')}
            </Button>
            <Button
              onClick={() => {
                dispatch(changeSort('name'));
              }}
              variant={key === 'name' ? 'secondary' : 'outline-secondary'}
            >
              По названию {key === 'name' && (order === 'asc' ? 'А-Я' : 'Я-А')}
            </Button>
          </ButtonGroup>
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
