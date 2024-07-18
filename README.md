<p align="center">
    <h1 align="center">Erin</h1>
    <p align="center">
      Self-hostable TikTok feed for your clips
      <br />
      Make a TikTok feed with your own videos
   </p>
</p>

## Introduction

Erin is a simple and self-hostable service that enables you to view your own clips using TikTok's well-known vertical swipe feed.
[A request was made on Reddit](https://www.reddit.com/r/selfhosted/comments/1dogl9d/selfhost_a_site_for_short_videos_like_tiktok/)
for a self-hostable app that can show filtered videos using TikTok's interface, so I made it. ([See screenshots](/screenshots))

## Features

Erin has all these features implemented :
- Display your own videos using TikTok's swipe feed
- Simple lazy-loading mechanism for your videos
- Automatic clip-naming based on file name
- Simple and optional security using a master password
- Support for HTTP and HTTPS
- Support for standalone / proxy deployment

On top of these, please note that Erin is only a React app powered entirely by [Caddy](https://github.com/caddyserver/caddy).
Caddy takes care of authentication, serving static files, and serving the React app all at once.

For more information, read about [Configuration](#configuration).

## Deployment and Examples

Before proceeding, regardless of Docker, Docker Compose, or a standalone deployment, please make sure
that you have created a `videos` directory containing all your video files. Later on, this directory will
be made available to your instance of Erin (by binding a volume to your Docker container, or putting the directory
next to your Caddyfile).

### Deploy with Docker

You can run Erin with Docker on the command line very quickly.

You can use the following commands :

```sh
# Create a .env file
touch .env

# Edit .env file ...

# Option 1 : Run Erin attached to the terminal (useful for debugging)
docker run --env-file .env -p <YOUR-PORT-MAPPING> -v ./videos:/srv/videos:ro mosswill/erin

# Option 2 : Run Erin as a daemon
docker run -d --env-file .env -p <YOUR-PORT-MAPPING> -v ./videos:/srv/videos:ro mosswill/erin
```

> **Note :** A `sample.env` file is located at the root of the repository to help you get started

> **Note :** When using `docker run --env-file`, make sure to remove the quotes around `AUTH_ENABLED` and `AUTH_SECRET`, or else
your container might crash due to unexpected interpolation and type conversions operated by Docker behind the scenes.

### Deploy with Docker Compose

To help you get started quickly, a few example `docker-compose` files are located in the ["examples/"](examples) directory.

Here's a description of every example :

- `docker-compose.simple.yml`: Run Erin as a front-facing service on port 443, with environment variables supplied in the `docker-compose` file directly.

- `docker-compose.proxy.yml`: A setup with Erin running on port 80, behind a proxy listening on port 443.

When your `docker-compose` file is on point, you can use the following commands :
```sh
# Run Erin in the current terminal (useful for debugging)
docker-compose up

# Run Erin in a detached terminal (most common)
docker-compose up -d

# Show the logs written by Erin (useful for debugging)
docker logs <NAME-OF-YOUR-CONTAINER>
```

### Deploy as a standalone application

Better documentation in progress, along with an installation script.

For interested readers, here's an outline :
- Make sure you have Node and Caddy installed on your machine
- Clone the repository, and `cd` to it
- Run `npm install` to install React dependenceies
- Run `npm build` to build the React App
- Copy `/docker/Caddyfile` at the root of the project
- Run `mkdir videos` and put your video files here
- Tweak your new Caddyfile to serve the newly-created `build` directory (replace `/srv` occurrences)
- Tweak your new Caddyfile to serve the newly-created `videos` directory (replace `/srv` occurrences)
- Create and configure a `.env` file at the root of the project
- Run `caddy run --envfile .env`
- Everything should work now, but read Caddy's logs and their documentation if you have issues

## Configuration

To run Erin, you will need to set the following environment variables in a `.env` file :

> **Note :** Regular environment variables provided on the commandline work too

> **Note :** A `sample.env` file is located at the root of the repository to help you get started

| Parameter               | Type      | Description                | Default |
| :---------------------- | :-------- | :------------------------- | ------- |
| `PUBLIC_URL`            | `boolean` | The public URL used to remotely access your instance of Erin. (Please include HTTP / HTTPS and the port if not standard 80 or 443. Do not include a trailing slash) (Read the [official Caddy documentation](https://caddyserver.com/docs/caddyfile/concepts#addresses)) | https://localhost        
| `AUTH_ENABLED`          | `string`  | Whether Basic Authentication should be enabled. (This parameter is case sensitive) (Possible values : true, false) | true |
| `AUTH_SECRET`           | `string`  | The secure hash of the password used to protect your instance of Erin. | Hash of `secure-password` |
| `APP_TITLE`             | `string`  | The custom title that you would like to display in the browser's tab. (Tip: You can use `[VIDEO_TITLE]` here if you want Erin to dynamically display the title of the current video.) | Erin - TikTok feed for your own clips |

> **Tip :** To generate a secure hash for your instance, use the following command :

```sh
docker run caddy caddy hash-password --plaintext "your-new-password"
```

> **Note :** When using `docker-compose.yml` environment variables, if your password hash contains dollar signs: double them all, or else the app will crash.
> For example : `$ab$cd$efxyz` becomes `$$ab$$cd$$efxyz`. This is due to caveats with `docker-compose` string interpolation system.

## Troubleshoot

Should you encounter any issue running Erin, please refer to the following common problems that may occur.

> If none of these matches your case, feel free to open an issue.

#### Erin is unreachable over HTTP / HTTPS

Erin sits on top of a Caddy web server.

As a result :
- You may be able to better troubleshoot the issue by reading your container logs.
- You can check the [official Caddy documentation regarding addresses](https://caddyserver.com/docs/caddyfile/concepts#addresses).
- You can check the [official Caddy documentation regarding HTTPS](https://caddyserver.com/docs/automatic-https).

Other than that, please make sure that the following requirements are met :

- If Erin runs as a standalone application without proxy :
    - Make sure your server / firewall accepts incoming connections on Erin's port.
    - Make sure your DNS configuration is correct. (Usually, such record should suffice : `A erin XXX.XXX.XXX.XXX` for `https://erin.your-server-tld`)
    - Make sure your `.env` file is well configured according to the [Configuration](#configuration) section.

- If Erin runs inside Docker / behind a proxy :
    - Perform the previous (standalone) verifications first.
    - Make sure that `PUBLIC_URL` is well set in `.env`.
    - Check your proxy forwarding rules.
    - Check your Docker networking setup.

In any case, the crucial part is [Configuration](#configuration) and reading the official Caddy documentation.

#### Erin says that no video was found on my server

For Erin to serve your video files, those must respect the following requirements :
- The file extension is one of `.mp4`, `.ogg`, `.webm`. (There are the only extensions supported by web browsers.)
- The files are located in `/srv/videos` on your Docker container using a volume.

To make sure that your videos are inside your Docker container and in the right place, you can :
- Run `docker exec -it <NAME-OF-YOUR-CONTAINER> sh`
- Inside the newly-opened shell, run : `ls /srv/videos`
- You should see your video files here. If not, then check your volume-binding.

If Erin is still unable to find your videos despite everything being well-configured, please open an issue
including the output of your browser's Javascript console and network tab when the request goes to `/media/`.
It may have to do with browser-caching, invalid configuration, or invalid credentials.

#### How can I add new videos to my feed?

For now, you should just put your new video files into your videos directory that is mounted with Docker.
Erin will automatically pick up these new files, and when you refresh your browser you'll see them.

#### How should I name my video files?

Erin will automatically translate your file name into a title to display on the interface.

The conversion operated is as follows :
- `-` becomes ` `
- `__` becomes ` - `

Here's a few examples to help you name your files :
- `Vegas-trip__Clip-1.mp4` becomes `Vegas trip - Clip 1`
- `Spanish-language__Lesson-1.mp4` becomes `Spanish language - Lesson 1`
- `Spiderman-1.ogg` becomes `Spiderman 1`

#### In what order will my files appear in the feed?

Erin randomly shuffles your video files on every browser refresh.

As a result, there is no specific order for your videos to appear.

#### Something else

Please feel free to open an issue, explaining what happens, and describing your environment.

## Credits

Hey hey ! It's always a good idea to say thank you and mention the people and projects that help us move forward.

Big thanks to the individuals / teams behind these projects :
- [tik-tok-clone](https://github.com/cauemustafa/tik-tok-clone) : For the base TikTok UI and smooth interaction.
- [Caddy](https://github.com/caddyserver/caddy) : For the lightweight and powerful web server.
- The countless others!

And don't forget to mention Erin if you like it or if it helps you in any way!
