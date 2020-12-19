CREATE TABLE public.books (
    id bigint NOT NULL,
    isbn text NOT NULL,
    title text NOT NULL,
    cover_image bytea,
    pages integer NOT NULL,
    classification text,
    year integer,
    language text
);
CREATE SEQUENCE public.book_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.book_id_seq OWNED BY public.books.id;
ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);
ALTER TABLE ONLY public.books
    ADD CONSTRAINT book_isbn_key UNIQUE (isbn);
ALTER TABLE ONLY public.books
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);
