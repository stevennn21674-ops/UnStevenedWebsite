ADDING MORE GAMES

Each game gets its own folder in the site root. The folder name can be anything.

Example:

UnStevenedWebsite/
  index.html
  app.js
  games.js
  games.json (optional backup)
  style.css
  TestGame/
    GameConfig.txt
    Test.html
    Test.png
  SnowRider/
    GameConfig.txt
    SnowRider.html
    SnowRider.png

IMPORTANT:
The homepage uses games.js as its main registry. This avoids the "Cannot load game JSON"
problem when index.html is opened directly from a computer (file://), because browsers
usually block fetch() for local JSON files.

To add a game, add one object to games.js:

{
  folder: "SnowRider",
  name: "Snow Rider",
  page: "SnowRider.html",
  thumbnail: "SnowRider.png"
}

Then create the SnowRider folder with those files.

GameConfig.txt can still be kept with the same format:
GameName: Snow Rider
HtmlName: SnowRider.html
HtmlThumnail: SnowRider.png

The site sorts all registered games alphabetically and puts every game in its own card.
