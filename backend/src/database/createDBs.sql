CREATE TABLE Songs 
(
    id VARCHAR PRIMARY KEY,
    type VARCHAR,
    href VARCHAR,
    album_name VARCHAR,
    track_number INT,
    duration_in_ms INT,
    release_date DATE,
    disc_number INT,
    has_credits BOOLEAN,
    has_lyrics BOOLEAN,
    name VARCHAR,
    artist_name VARCHAR,
    content_rating VARCHAR
);

CREATE TABLE Genres
(
    id         SERIAL PRIMARY KEY,
    song_id    VARCHAR REFERENCES Songs (id) ON DELETE CASCADE,
    genre_name VARCHAR
);

CREATE TABLE Artwork 
(
    id SERIAL PRIMARY KEY,
    song_id VARCHAR REFERENCES Songs(id) ON DELETE CASCADE,
    width INT,
    height INT,
    url VARCHAR
);