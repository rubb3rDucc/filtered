import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable
} from 'kysely';

export interface Database {
    artwork: ArtworkTable,
    genres: GenresTable,
    songs: SongsTable
}

export interface ArtworkTable {
    id: Generated<number>
    song_id: string
    width: number
    height: number
    url: string
}

// export type Artwork = Selectable<ArtworkTable>
// export type NewArtwork = Insertable<ArtworkTable>
// export type UpdateArtwork = Updateable<ArtworkTable>

export interface GenresTable {
    id: Generated<number>
    song_id: string
    genre_name: string
}

// export type Genres = Selectable<GenresTable>
// export type NewGenres = Insertable<GenresTable>
// export type UpdateGenres = Updateable<GenresTable>

export interface SongsTable {
    id: Generated<number>
    type: string
    href: string
    album_name: string
    track_number: number
    duration_in_ms: number
    release_date: Date
    disc_number: number
    has_credit: boolean
    has_lyrics: boolean
    name: string
    artist_name: string
    content_rating: string
}

// export type Songs = Selectable<SongsTable>
// export type NewSongs = Insertable<SongsTable>
// export type UpdateSongs = Updateable<SongsTable>


type Tables = {
    person: {
        id: number;
        first_name: string;
    },
    product: {
        id: string;
        name: string;
        createdAt: Date
    }
};

type TableNames = keyof Tables;