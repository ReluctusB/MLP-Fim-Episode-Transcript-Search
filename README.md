# MLP: FiM Episode Transcript Search

What it says on the tin. Search MLP episode transcripts with ease. Supports RegEx! Transcript data acquired from [here](https://www.kaggle.com/jwiens/my-little-pony-friendship-is-magic-episode-data/version/1). Additional transcript data and corrections done by the dev.

## Development

This website runs on [Node.js](https://nodejs.org/en) and requires [Yarn](https://yarnpkg.com/).

To run a local version of the tool, navigate to the root in your terminal and run `yarn run start`.

The icons used are from [Bootstrap Icons](https://icons.getbootstrap.com/). Please stick with this icon set if possible.

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

All search fields support Regular Expressions. Regular Expressions are a powerful way to search through text. You can learn more about them [here](https://www.regular-expressions.info/). 

As an example, if you wanted to search for 'Tom' and only 'Tom', you could use the following:
```
\bTom\b
```
This will match only the word 'Tom', while ignoring words like 'Tomorrow'.

### What's in here

- Every episode of My Little Pony: Friendship is Magic
- My Little Pony: The Movie
- My Little Pony: Rainbow Roadtrip
- My Little Pony: Best Gift Ever
- Animated Shorts

### What isn't in here

- All My Little Pony: Equestria Girls content
- My Little Pony: Pony Life

