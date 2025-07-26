import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
  };
  if (search.trim() !== "") {
    params.search = search;
  }

  const { data } = await instance.get<{
    notes: Note[];
    totalPages: number;
  }>("/", { params });

  return {
    notes: data.notes,
    totalPages: data.totalPages,
  };
};

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const { data } = await instance.post<Note>("/", note);
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/${id}`);
  return data;
};
