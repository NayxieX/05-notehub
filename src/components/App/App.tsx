import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";

import css from "./App.module.css";

import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { fetchNotes } from "../../services/noteService";
import useDebounce from "../../hooks/useDebounce";
import type { FetchNotesResponse } from "../../services/noteService";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: () => {
      const previousData = queryClient.getQueryData<FetchNotesResponse>([
        "notes",
        page - 1,
        debouncedSearch,
      ]);
      return previousData ?? { notes: [], totalPages: 1, totalNotes: 0 };
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={(val) => setSearch(val)} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen &&
        createPortal(
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>,
          document.body
        )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
    </div>
  );
}

export default App;
