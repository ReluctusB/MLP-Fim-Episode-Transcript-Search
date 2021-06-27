# MLP: FiM Episode Transcript Search

What it says on the tin. Search MLP episode transcripts with ease. Supports RegEx! Transcript data acquired from [here](https://www.kaggle.com/jwiens/my-little-pony-friendship-is-magic-episode-data/version/1).

## Search Help

To search by character speaking, use `{character:character name}`:

```
{character:Sweetie Bell}
```

To search by episode title, use `{episode:episode name}`:

```
{episode:Fall Weather Friends}
```

For example:
```
{episode:Fall Weather Friends} {character:Rainbow Dash} Applejack
```
This will return any line in Fall Weather Friends spoken by Rainbow Dash containing the word 'Applejack'.

All search fields support Regular Expressions.