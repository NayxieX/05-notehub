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
  items: Note[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await instance.get<{ notes: Note[]; totalPages: number }>(
    "",
    { params }
  );

  return {
    items: data.notes,
    totalItems: data.notes.length, // якщо API не повертає totalItems — підраховуємо вручну
    totalPages: data.totalPages,
    page,
    perPage,
  };
};

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const { data } = await instance.post<Note>("", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/${id}`);
  return data;
};
