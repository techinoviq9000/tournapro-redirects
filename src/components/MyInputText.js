import { useField } from "formik";
import { Box, Input } from "native-base";

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
      <Box>
      <Input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <Text>{meta.error}</Text>
      ) : null}
    </Box>
  );
};

export default MyTextInput