# PonePonePone - MLP: FiM Episode Transcript Search

<p align="center">
  <a href="https://poneponepone.org/">Website</a>
</p>

What it says on the tin. Search MLP episode transcripts with ease. Supports RegEx! Transcript data acquired from [here](https://www.kaggle.com/jwiens/my-little-pony-friendship-is-magic-episode-data/version/1). Additional transcript data and corrections done by the dev.

## Development

This website runs on [Node.js](https://nodejs.org/en) and requires [Yarn](https://yarnpkg.com/).

To run a local version of the tool, navigate to the root in your terminal and run `yarn run start`.

The icons used are from [Bootstrap Icons](https://icons.getbootstrap.com/). Please stick with this icon set if possible.

The quote scorer for Pone Pone Don't Tell Me! is written in Rust. Navigate to `quote-scorer` and use `cargo run` to re-generate the data for the game. Note that you should only need to do this if you've made a change to the episodes.json.

## Search Help

Information about the site has moved [here](https://poneponepone.org/?page=help).

## Corpus

### What's in here

- Every episode of My Little Pony: Friendship is Magic
- My Little Pony: The Movie
- My Little Pony: Rainbow Roadtrip
- My Little Pony: Best Gift Ever
- Animated Shorts

### What isn't in here

- All My Little Pony: Equestria Girls content
- My Little Pony: Pony Life
- Anything that isn't G4

