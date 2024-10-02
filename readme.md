# Filtered

Filtered is an app where users can sort their Apple Music library to create playlists.

## Technologies Used

- Database
  - PostgreSQL
- Frontend
  - React
- Backend
  - NodeJS
  
## Installation

### Preflight information

- You will need your own Apple Developer Token to develop or use this App
- Before doing the token refresh, create a /tmp folder (i.e., filtered/tmp) in the base folder and create the following files:
  - developerAPIToken.txt
  - userAPIToken.txt
  - tempLibraryDB.json
    - stores user Apple Music Library before sending it to the database
- To refresh the generated user and developer API tokens (which expire after 10 minutes), navigate to http://localhost:3000

### Developing

- backend (in the base folder, "/")

```bash
npm run dev
```

- frontend

```bash
cd /frontend
npm run start
```

## Usage

idk tba

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)