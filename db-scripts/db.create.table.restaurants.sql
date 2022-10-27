-- Table: public.restaurants

-- DROP TABLE IF EXISTS public.restaurants;

CREATE TABLE IF NOT EXISTS public.restaurants
(
    restaurant_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character(250) COLLATE pg_catalog."default" NOT NULL,
    description character(500) COLLATE pg_catalog."default",
    CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id),
    CONSTRAINT u_restaurant_name UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.restaurants
    OWNER to postgres;