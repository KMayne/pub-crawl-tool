# pub-crawl-tool
##### A web app for tracking progress & points on the 2018 circle line pub crawl.

This web app allows for tracking you and your fellow crawlers through the [circle line pub crawl](http://www.circlelinepubcrawl.co.uk/).
For a bit of fun, we also had point penalties for things (e.g. losing something) on
our pub crawl. This tool was created by me in about 14 hours to track those points (and an additional 6 hours for adding the tracking feature & deploying v2). I.e. it is a bit janky in places

## Running

Simply install the dependencies and run the start script:
```
npm install
npm start
```

You'll also need to set up a mongodb instance.

To use the site, follow the link that is printed when you start the server then
add a user in the admin page. You should then copy the generated link and
visit it to update the key your browser holds.

## Future Development
Before the next pub crawl, I'll definitely add image uploading and fix some bugs.

## Credits

Thanks to "Twitter Emoji" for the beer icon https://iconscout.com/icon/beer-mug-glass-drink-cocktail-emoj-symbol-babr
Thanks to Stephen Hutchings for the user icon https://www.iconfinder.com/icons/216498/user_icon#size=128

#### Tags

pub crawl, points tracker, circle line, glasgow sub
