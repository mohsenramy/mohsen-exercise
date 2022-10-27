-- Table: public.openingtimes

-- DROP TABLE IF EXISTS public.openingtimes;

CREATE TABLE IF NOT EXISTS public.openingtimes
(
    opening_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    restaurant_id integer,
    open time without time zone NOT NULL,
    close time without time zone NOT NULL,
    day smallint NOT NULL,
    CONSTRAINT openingtimes_pkey PRIMARY KEY (opening_id),
    CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id)
        REFERENCES public.restaurants (restaurant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.openingtimes
    OWNER to postgres;