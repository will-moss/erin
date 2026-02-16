## [1.19.2](https://github.com/will-moss/erin/compare/v1.19.1...v1.19.2) (2026-02-16)


### Bug Fixes

* **build:** final fix to produce multi-arch image ([69166b8](https://github.com/will-moss/erin/commit/69166b854dd68b590bfae62c8550190cbbd38a66))

## [1.19.1](https://github.com/will-moss/erin/compare/v1.19.0...v1.19.1) (2026-02-16)


### Bug Fixes

* **build:** removed unnecessary platform option causing crash on non-ARM machines ([6b151c9](https://github.com/will-moss/erin/commit/6b151c92dcc8971e9df7a779217c2ac5034d6b18))

# [1.19.0](https://github.com/will-moss/erin/compare/v1.18.5...v1.19.0) (2026-02-16)


### Bug Fixes

* **build:** updated Caddy version to work with the replace-response plugin ([36dcb6d](https://github.com/will-moss/erin/commit/36dcb6d316a1256574755be39434dc8c149dd5db))
* **build:** updated Dockerfile to make it easier to build multi-arch image on ARM ([6bd75ae](https://github.com/will-moss/erin/commit/6bd75ae81c7130908a3cc76e56f8e043cbd21ace))
* **fullscreen:** adjusted the position of the video playback tracker in fullscreen mode ([43cc79e](https://github.com/will-moss/erin/commit/43cc79ec3970e72ee1b428c969601e82044bc45e))


### Features

* **player:** added a scrubber that can be dragged to jump to any point within the current video ([20788af](https://github.com/will-moss/erin/commit/20788aff077b78b1116f698bc43e4aa97a31cfd7))

# [1.19.0](https://github.com/will-moss/erin/compare/v1.18.5...v1.19.0) (2026-02-16)


### Bug Fixes

* **build:** updated Caddy version to work with the replace-response plugin ([36dcb6d](https://github.com/will-moss/erin/commit/36dcb6d316a1256574755be39434dc8c149dd5db))
* **fullscreen:** adjusted the position of the video playback tracker in fullscreen mode ([43cc79e](https://github.com/will-moss/erin/commit/43cc79ec3970e72ee1b428c969601e82044bc45e))


### Features

* **player:** added a scrubber that can be dragged to jump to any point within the current video ([20788af](https://github.com/will-moss/erin/commit/20788aff077b78b1116f698bc43e4aa97a31cfd7))

## [1.18.5](https://github.com/will-moss/erin/compare/v1.18.4...v1.18.5) (2025-10-01)


### Bug Fixes

* **encoding:** disabled cache entirely for now, and fixed the encoding on the lazyloading part ([74f40eb](https://github.com/will-moss/erin/commit/74f40eb6c945b55b07039ad39fbcfca2c327339a)), closes [#28](https://github.com/will-moss/erin/issues/28)

## [1.18.4](https://github.com/will-moss/erin/compare/v1.18.3...v1.18.4) (2025-10-01)


### Bug Fixes

* **playlists:** updated the link/src encodings to match previous update and support # and @ in URL ([45061f1](https://github.com/will-moss/erin/commit/45061f122b428db8d6aa63f763978e54241f03da))

## [1.18.3](https://github.com/will-moss/erin/compare/v1.18.2...v1.18.3) (2025-09-30)


### Bug Fixes

* **global:** enabled previously-forbidden characters in video filenames (# and @ + others) ([3a6cefb](https://github.com/will-moss/erin/commit/3a6cefb175eb6bc1e66c747d35e7ae0c8180acdc)), closes [#28](https://github.com/will-moss/erin/issues/28)

## [1.18.2](https://github.com/will-moss/erin/compare/v1.18.1...v1.18.2) (2025-09-30)


### Bug Fixes

* **ui:** the mute/unmute button is now clickable (it wasn't before due to a CSS depth issue) ([58b2f54](https://github.com/will-moss/erin/commit/58b2f54d3a912db86db92a5ff2d63e15ef17bb4e)), closes [#27](https://github.com/will-moss/erin/issues/27)

## [1.18.1](https://github.com/will-moss/erin/compare/v1.18.0...v1.18.1) (2025-09-17)


### Bug Fixes

* **share:** fixed the share link generated when tapping the share button ([1e89055](https://github.com/will-moss/erin/commit/1e89055491fa8b544d9cab0f5a0026df79ff863f))

# [1.18.0](https://github.com/will-moss/erin/compare/v1.17.0...v1.18.0) (2025-09-17)


### Features

* **client:** added a Share feature to send a link to a specific clip ([aef415c](https://github.com/will-moss/erin/commit/aef415c0b2951d5275d31f2b0da4457ceed108dc)), closes [#19](https://github.com/will-moss/erin/issues/19)

# [1.17.0](https://github.com/will-moss/erin/compare/v1.16.0...v1.17.0) (2025-07-31)


### Features

* **playlists:** added support for playlist-level/folder-level metadata ([ebf5b26](https://github.com/will-moss/erin/commit/ebf5b267a26b9ce120f1dfca4c69f0fa7d9ea9bd)), closes [#23](https://github.com/will-moss/erin/issues/23)

# [1.16.0](https://github.com/will-moss/erin/compare/v1.15.0...v1.16.0) (2025-05-12)


### Bug Fixes

* **client:** improved styling of playlist gallery on larger screens ([9721ec5](https://github.com/will-moss/erin/commit/9721ec512fb0de71eee3b0967382d283191191c7)), closes [#16](https://github.com/will-moss/erin/issues/16)


### Features

* **styling:** added support for custom styling via a stylesheet injected at runtime ([a582f62](https://github.com/will-moss/erin/commit/a582f62fd9f3d54bbd47481cc53b7256c6a7b57c)), closes [#19](https://github.com/will-moss/erin/issues/19)

# [1.15.0](https://github.com/will-moss/erin/compare/v1.14.3...v1.15.0) (2025-03-15)


### Features

* **client:** added playlist gallery feature with direct link to either play playlist or video ([16ae9dd](https://github.com/will-moss/erin/commit/16ae9dd37e24cb0c523312c3728e53699bb81db3)), closes [#16](https://github.com/will-moss/erin/issues/16)

## [1.14.3](https://github.com/will-moss/erin/compare/v1.14.2...v1.14.3) (2025-03-13)


### Bug Fixes

* **client:** added a check to ensure that video files are filtered by playlist only when necessary ([63508b2](https://github.com/will-moss/erin/commit/63508b24400eb911a927b40d32b77c4c3eb307c2)), closes [#18](https://github.com/will-moss/erin/issues/18)

## [1.14.2](https://github.com/will-moss/erin/compare/v1.14.1...v1.14.2) (2025-03-11)


### Bug Fixes

* **client:** added a guard to prevent the app from crashing when a lot of files were loaded ([4df6be5](https://github.com/will-moss/erin/commit/4df6be51b8ff06ad604c4ac6c0e5dd1060192604)), closes [#18](https://github.com/will-moss/erin/issues/18)

## [1.14.1](https://github.com/will-moss/erin/compare/v1.14.0...v1.14.1) (2025-02-19)


### Bug Fixes

* **client:** fixed CSS styling causing horizontal scrolling glitches ([d166944](https://github.com/will-moss/erin/commit/d1669447a4637891765de4609467d6433b6154ef)), closes [#17](https://github.com/will-moss/erin/issues/17)

# [1.14.0](https://github.com/will-moss/erin/compare/v1.13.1...v1.14.0) (2025-02-18)


### Features

* **client:** added support for horizontal feed scroll direction and associated env setting ([645e09e](https://github.com/will-moss/erin/commit/645e09e6907aacc28415b81cc5732e930d1c1df6)), closes [#17](https://github.com/will-moss/erin/issues/17)

# [1.14.0](https://github.com/will-moss/erin/compare/v1.13.1...v1.14.0) (2025-02-18)


### Features

* **client:** added support for horizontal feed scroll direction and associated env setting ([645e09e](https://github.com/will-moss/erin/commit/645e09e6907aacc28415b81cc5732e930d1c1df6)), closes [#17](https://github.com/will-moss/erin/issues/17)

## [1.13.1](https://github.com/will-moss/erin/compare/v1.13.0...v1.13.1) (2025-01-17)


### Bug Fixes

* **build:** dummy commit for a newer version ([ecab50b](https://github.com/will-moss/erin/commit/ecab50b4710ea37a5927ac40b334fabe76467015))

# [1.13.0](https://github.com/will-moss/erin/compare/v1.12.5...v1.13.0) (2025-01-17)


### Features

* **client:** added support for ignoring hidden files and folders ([919073b](https://github.com/will-moss/erin/commit/919073be37d9ab333b11fd0894f9f8623020583f)), closes [#15](https://github.com/will-moss/erin/issues/15)

## [1.12.5](https://github.com/will-moss/erin/compare/v1.12.4...v1.12.5) (2024-12-26)


### Bug Fixes

* **client:** changed the way the public url is built on the client to make it more flexible ([e48813e](https://github.com/will-moss/erin/commit/e48813ed30f14c87f4d3ce6aef815f343b5fdf3e)), closes [#13](https://github.com/will-moss/erin/issues/13)

## [1.12.4](https://github.com/will-moss/erin/compare/v1.12.3...v1.12.4) (2024-10-28)


### Bug Fixes

* **server:** edited Caddy configuration to support playlists rather than redirect 404 ([b0977b4](https://github.com/will-moss/erin/commit/b0977b471035ca181dc6fa80191d56b29ba687ea)), closes [#10](https://github.com/will-moss/erin/issues/10)

## [1.12.3](https://github.com/will-moss/erin/compare/v1.12.2...v1.12.3) (2024-10-28)


### Bug Fixes

* **encoding:** fixed and rewrote playlist identification and linking to better support every chars ([8f32876](https://github.com/will-moss/erin/commit/8f3287699585a269e314502204bea0c0d27e71ec)), closes [#10](https://github.com/will-moss/erin/issues/10)

## [1.12.2](https://github.com/will-moss/erin/compare/v1.12.1...v1.12.2) (2024-10-27)


### Bug Fixes

* **encoding:** added support for special symbols and percents in the playlists' and files' name ([d05719a](https://github.com/will-moss/erin/commit/d05719a89cc0a272665904c8dc1a0c8e677f436e)), closes [#10](https://github.com/will-moss/erin/issues/10)

## [1.12.1](https://github.com/will-moss/erin/compare/v1.12.0...v1.12.1) (2024-10-27)


### Bug Fixes

* **encoding:** added support for emojis in the playlists' and files' name ([464b199](https://github.com/will-moss/erin/commit/464b199123c7fd71cce2dca824b485e6e739dfe4)), closes [#10](https://github.com/will-moss/erin/issues/10)

# [1.12.0](https://github.com/will-moss/erin/compare/v1.11.0...v1.12.0) (2024-10-26)


### Bug Fixes

* **playlists:** added support for Asian (and non-ascii) characters in general ([61de3b5](https://github.com/will-moss/erin/commit/61de3b5664b9a9914da75a54665ca73a10a6fd5c)), closes [#10](https://github.com/will-moss/erin/issues/10)


### Features

* **client:** added (OS-based) dark theme support for playlist and blacklist managers ([b1b98d1](https://github.com/will-moss/erin/commit/b1b98d1cf6ded831f7445911cf501216fdc08c66)), closes [#10](https://github.com/will-moss/erin/issues/10)
* **client:** added a dedicated play/pause button to replace the tap-to-pause gesture ([cbcbeeb](https://github.com/will-moss/erin/commit/cbcbeebdb2244b61d78fc8707da4ffe3fde7fa75)), closes [#10](https://github.com/will-moss/erin/issues/10)
* **client:** added collapsible navigation in fullscreen mode, with mouse move activation ([4023e7d](https://github.com/will-moss/erin/commit/4023e7d657c8654defe3e1fd7696325033209607)), closes [#10](https://github.com/will-moss/erin/issues/10)

# [1.11.0](https://github.com/will-moss/erin/compare/v1.10.3...v1.11.0) (2024-10-25)


### Bug Fixes

* **cache:** fixed caching mechanism broken due to random shuffling in the first place ([69c50db](https://github.com/will-moss/erin/commit/69c50dbb7d84ca0bb21c2d9ee81f33b449b5a629))


### Features

* **client:** added double-tap-to-toggle fullscreen feature ([43b26d9](https://github.com/will-moss/erin/commit/43b26d9867bdd96dd70093be35c22b2d5dad1451)), closes [#10](https://github.com/will-moss/erin/issues/10)
* **project:** added support for playlists with UI navigation and auto-discovery on the server ([09daea9](https://github.com/will-moss/erin/commit/09daea9d0677e9f14f3c1b82c8f3cc2547d097ad)), closes [#10](https://github.com/will-moss/erin/issues/10)

## [1.10.2](https://github.com/will-moss/erin/compare/v1.10.1...v1.10.2) (2024-09-15)


### Performance Improvements

* **client:** big performance improvement on metadata-loading and authentication ([ee2bda5](https://github.com/will-moss/erin/commit/ee2bda506addfd1bf81913481a06b25cf587a5f3))

## [1.10.1](https://github.com/will-moss/erin/compare/v1.10.0...v1.10.1) (2024-09-14)


### Bug Fixes

* **style:** improved video metadata's style for long content and contrast ([231241c](https://github.com/will-moss/erin/commit/231241c2dad8959a4046ad5162abbd1e0cda27cc))

# [1.10.0](https://github.com/will-moss/erin/compare/v1.9.0...v1.10.0) (2024-09-14)


### Features

* **project:** added support for video metadata using Tiktok UI with channel, link, and caption ([bd61dec](https://github.com/will-moss/erin/commit/bd61dec01135dfa389b2d0720cf8e99affce946f)), closes [#7](https://github.com/will-moss/erin/issues/7)

# [1.9.0](https://github.com/will-moss/erin/compare/v1.8.0...v1.9.0) (2024-09-13)


### Features

* **client:** added double-tap seek feature for mobile users ([7e70d6f](https://github.com/will-moss/erin/commit/7e70d6ff1d120418d5252b1996e58321452d9003)), closes [#6](https://github.com/will-moss/erin/issues/6)

# [1.8.0](https://github.com/will-moss/erin/compare/v1.7.0...v1.8.0) (2024-09-09)


### Features

* **client:** added capture of down and up arrows to ease scrolling when page is not focused ([1c7466d](https://github.com/will-moss/erin/commit/1c7466d709e6d64ed7e22687d82e3908fe98dcbe))

# [1.7.0](https://github.com/will-moss/erin/compare/v1.6.1...v1.7.0) (2024-09-09)


### Features

* **client:** added support for moving the progress bar to the top / bottom via an env variable ([ddb4485](https://github.com/will-moss/erin/commit/ddb44854d5b13e509cb7a20c494b1e9455ab056f)), closes [#6](https://github.com/will-moss/erin/issues/6)
* **client:** added support for seeking a video forward and backward using the left and right arrows ([0154aa8](https://github.com/will-moss/erin/commit/0154aa884cf81e956e2598e96fec56b7d6b7b0ed)), closes [#6](https://github.com/will-moss/erin/issues/6)

## [1.6.1](https://github.com/will-moss/erin/compare/v1.6.0...v1.6.1) (2024-09-02)


### Bug Fixes

* **client:** the autoplay feature is now working consistently across browsers and operating systems ([478f1dc](https://github.com/will-moss/erin/commit/478f1dcb4902207fc2e9dd65ab906ae78690ba93))

# [1.6.0](https://github.com/will-moss/erin/compare/v1.5.0...v1.6.0) (2024-08-30)


### Features

* **client:** added a progress tracker under the video player ([e16b861](https://github.com/will-moss/erin/commit/e16b861da7cb06718a7ca9fe15aacdfca4e6b636))

# [1.5.0](https://github.com/will-moss/erin/compare/v1.4.1...v1.5.0) (2024-08-09)


### Features

* **client:** added autoplay feature, to automatically swipe to the next video when current ended ([cedc52e](https://github.com/will-moss/erin/commit/cedc52e865ef0f964509334d1187303973736ce3))

## [1.4.1](https://github.com/will-moss/erin/compare/v1.4.0...v1.4.1) (2024-07-30)


### Bug Fixes

* **client:** muting / Unmuting the player won't trigger a freeze anymore ([5507870](https://github.com/will-moss/erin/commit/55078702b41f25871b2f78722c2f35885070c208))

# [1.4.0](https://github.com/will-moss/erin/compare/v1.3.0...v1.4.0) (2024-07-30)


### Bug Fixes

* **client:** added a guard to prevent JS errors when swiping too fast ([7e3e7d3](https://github.com/will-moss/erin/commit/7e3e7d37c0011321227c66736848bf76ba835900))
* **client:** rewrote the feed entirely to avoid causing a memory hog on instances with many videos ([a2c9cb2](https://github.com/will-moss/erin/commit/a2c9cb21a19823f25ac38733597c76fe60e49acc))


### Features

* **client:** added visual hover effects and borders on buttons, to make it more usable on mobile ([cda85cf](https://github.com/will-moss/erin/commit/cda85cf16d38f2dfc90fd525d808433272eb8c24))

# [1.3.0](https://github.com/will-moss/erin/compare/v1.2.1...v1.3.0) (2024-07-26)


### Features

* **client:** added the ability to show a specific feed by changing the URL's path to match a folder ([7f24988](https://github.com/will-moss/erin/commit/7f24988cd0359709a60517fe935bbe27a0be3adf))

## [1.2.1](https://github.com/will-moss/erin/compare/v1.2.0...v1.2.1) (2024-07-26)


### Bug Fixes

* **client:** added a proper random-shuffling algorithm to replace the previous one ([28711cd](https://github.com/will-moss/erin/commit/28711cdc5c30b183728a33c777e655f3ffcacd47))
* **client:** attempt at improving loading speed and caching of videos ([a2fe0c1](https://github.com/will-moss/erin/commit/a2fe0c1469b95f0af53b40b661e2218efe26fceb))
* **client:** increased the bottom controls' width to make it easier to use them on mobile ([1b2c80e](https://github.com/will-moss/erin/commit/1b2c80e110b8ee73fa4b0befe8e2f31733035a64))
* **client:** made the mask feature move on to the next video, rather than to the previous one ([6d20cc1](https://github.com/will-moss/erin/commit/6d20cc133b2c5083a520387548116d77ccc0793b))

# [1.2.0](https://github.com/will-moss/erin/compare/v1.1.1...v1.2.0) (2024-07-24)


### Bug Fixes

* **client:** increased input font size for Safari users (to prevent zoom), and enforced mp4 files ([bcb44a5](https://github.com/will-moss/erin/commit/bcb44a590e9afdea281f3deec0fd57cb0658cf85))
* **client:** new attempt to make the address bar disappear on mobile browsers (Chrome / Safari) ([6a8c2fc](https://github.com/will-moss/erin/commit/6a8c2fc4c4026afa9a0f52571aee35a97af81998))
* **client:** removed unnecessary testing delay for cache ([e439954](https://github.com/will-moss/erin/commit/e439954c721673366216b12e4fd73ec41e19130e))
* **client:** reverted a change preventing users from reading anything other than mp4 on Safari ([df57531](https://github.com/will-moss/erin/commit/df575310660ee6c4cbdc27310cbf7122db994af3))
* **client:** rewrote the video's title bar to fix the visibility issue on mobile ([65a6c84](https://github.com/will-moss/erin/commit/65a6c84acfdd9688c3c6da77131ae69f1463f7a4))


### Features

* **client:** added blacklist feature : You can now hide videos from your feed ([5f0afdd](https://github.com/will-moss/erin/commit/5f0afdd8563ed7cb0fb0c2f75e2a5d70734549c6))
* **client:** added blacklist manager to view and unmask previously-masked videos ([b9af397](https://github.com/will-moss/erin/commit/b9af397f15b842e84f91aa77754ce39e00bec5e8))
* **client:** added local cache to improve loading performances ([18a71fe](https://github.com/will-moss/erin/commit/18a71fe7b5c210767168e55e486266b45a6aae0a))

## [1.1.1](https://github.com/will-moss/erin/compare/v1.1.0...v1.1.1) (2024-07-21)


### Bug Fixes

* **client:** fixed the download feature to download the proper video, not always the first one ([13a0b30](https://github.com/will-moss/erin/commit/13a0b3098f8800fede184637e60611e814783ff5))
* **client:** the downloaded video now has the proper file name, rather than a part of the auth hash ([6bcf85e](https://github.com/will-moss/erin/commit/6bcf85e320431f52f1087f44fca3c9d05af9c692))

# [1.1.0](https://github.com/will-moss/erin/compare/v1.0.0...v1.1.0) (2024-07-19)


### Bug Fixes

* **build:** fixed the Docker's Caddyfile so that the browser's app title works with quotes ([f89f87e](https://github.com/will-moss/erin/commit/f89f87e1a3157de22119e6b76ad7b5ff2ca79e5f))


### Features

* **client:** make the app full-screen or adress-bar-less on mobile ([cb2d3de](https://github.com/will-moss/erin/commit/cb2d3de681b54e20492ea2df820590d0db220f5f))

# 1.0.0 (2024-07-18)


### Bug Fixes

* **client:** added a check to prevent Safari from crashing when trying to read .ogg video files ([d253e5b](https://github.com/will-moss/erin/commit/d253e5b7399d850023d024df978aec8cc732d217))
* **client:** fixed a bug causing videos to keep playing and overlap audio in the background ([68a560c](https://github.com/will-moss/erin/commit/68a560c172f9c560b7f3da880f7df7087d844816))
* **client:** improved the browser tab's title generation to support authentication ([8f37281](https://github.com/will-moss/erin/commit/8f372819364d352715198f0202fcffff204edb24))
* **client:** removed code causing a JS crash : The play() request [...] removed from the document ([72ccc0b](https://github.com/will-moss/erin/commit/72ccc0bfa816bbbd2144348ceb56efb2532637cf))
* **client:** the tall letters are not truncated anymore, and the title's font size was increased ([98b3ae3](https://github.com/will-moss/erin/commit/98b3ae3252e90051f10bb661ebcf29da759fb8d3))
* **client:** the video player doesn't stretch videos anymore, and there is no more cut at the bottom ([0cc03ef](https://github.com/will-moss/erin/commit/0cc03ef4354c2f358023a40b6dac40f17af8205d))


### Features

* **client:** added download feature : You can now download the current video on your device ([a2fde4c](https://github.com/will-moss/erin/commit/a2fde4c559647d1ae2d219d3b51dea19cc8004e8))
* **client:** added support for custom browser tab's title, with dynamic use of the video's title ([5974407](https://github.com/will-moss/erin/commit/5974407390762cb64f03508d0b600328d7bbf3e9))
* **client:** the videos are now all retrieved recursively from the file server, in every folder ([734a164](https://github.com/will-moss/erin/commit/734a1642bac2102c32f5b9218fe5dcfc435316b9))
