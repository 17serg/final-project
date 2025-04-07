import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid2 } from "@mui/material";
import { IBookCreateData } from "@/entities/book/model";

import { useUser } from "@/entities/user/hooks/useUser";
import BookCard from "@/entities/book/ui/ProductCard/BookCard";
import { Box, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/shared/lib/reduxHooks";
import { addBookThunk} from "../bookSlice/thunk";

export default function BookAddForm(): React.JSX.Element {
  const books = useAppSelector((state) => state.books.usersBooks);
  const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(loadUserBooksThunk())
  // },[])

  const { user } = useUser();
  console.log(user)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IBookCreateData>({
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
    mode: "onBlur",
  });

  const 
  onSubmit: SubmitHandler<IBookCreateData> = (data) => {
    dispatch(addBookThunk(data))
      .then(() => reset())
      .catch(console.log);
  };

  return (
    <>
    <Grid2 container justifyContent="center">
      <Box
        component="form"
        py={5}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={2}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Title must not exceed 100 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              variant="outlined"
              label="Title"
              type="text"
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ minWidth: 200 }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
            maxLength: {
              value: 500,
              message: "Description must not exceed 500 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              variant="outlined"
              label="Description"
              type="text"
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ minWidth: 200 }}
              //   multiline
              rows={2}
            />
          )}
        />

      
        <Controller
          name="link"
          control={control}
          rules={{
            required: "URL is required",
            pattern: {
              value:
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z]{2,63})(:\d{1,5})?([\/?#]\S*)?$/i,
              message: "Enter a valid URL (e.g., https://example.com)",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              variant="outlined"
              label="URL"
              type="url"
              error={!!errors.link}
              helperText={errors.link?.message}
              sx={{ minWidth: 250 }}
            />
          )}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={Object.keys(errors).length > 0 || !isDirty}
          sx={{ height: 40 }}
        >
          Add Product
        </Button>
      </Box>
    </Grid2>
     <Paper elevation={0}>
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
   </>
  );
}
