import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import { useCreateNote } from "../../hooks/useCreateNote";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Max length is 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const { mutate, isPending, error } = useCreateNote(onCancel);

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutate({ ...values, tag: values.tag as NoteTag });
        resetForm(); 
      }}
    >
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <FormikError
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          {error && (
            <div className={css.error}>
              {(error as Error).message || "Failed to create note"}
            </div>
          )}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isPending}
            >
              {isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
