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
