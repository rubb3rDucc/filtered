export default function SongList({ list }) {
    return (
        <>
            <ol>
                <p>{list.length}</p>
                {list.map((el, idx) => {
                    return (
                        <li key={idx}>
                            <h2>
                                {el.name}
                            </h2>
                            <p>
                                {el.artist_name}
                            </p>
                            <p>
                                {el.album_name}
                            </p>
                        </li>
                    )
                })}
            </ol>
        </>
    )
}