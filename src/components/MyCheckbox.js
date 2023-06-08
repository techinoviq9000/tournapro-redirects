import { Box, Input } from "native-base";
import { useField } from "formik";

const MyCheckbox = ({ children, ...props }) => {
  // React treats radios and checkbox inputs differently from other input types: select and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <Box>
      <Box>
        <Input type="checkbox" {...field} {...props} />
        {children}
      </Box>
      {meta.touched && meta.error ? (
        <Text>{meta.error}</Text>
      ) : null}
    </Box>
  );
};

export default MyCheckbox