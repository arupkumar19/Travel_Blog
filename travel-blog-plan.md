# My Travel Journal --- Travel Blog Website

A personal, photo-focused travel blog organized by **year, month, and
destination**. The site will be hosted on GitHub Pages, with photos
stored in the GitHub repository and videos embedded from a video-hosting
service.

## 1. Project Goals

-   Showcase trips through photographs, videos, and travel stories.
-   Organize trips by year, month, and place.
-   Make the site responsive on desktop, tablet, and mobile.
-   Keep hosting simple and low-cost using GitHub Pages.
-   Make it easy to add future trips without needing a database or
    backend.

## 2. Recommended Technology

  Area                               Choice
  ---------------------------------- ------------------------------------------
  Hosting                            GitHub Pages
  Source control and photo storage   GitHub repository
  Frontend                           HTML, CSS, JavaScript
  Trip metadata                      JSON files
  Photo gallery                      Responsive grid with lightbox
  Videos                             Embedded YouTube or another video host
  Backend/database                   Not required for the initial static site

## 3. Main Website Pages and Features

### Home page

-   Travel blog title and introductory banner.
-   Featured trips and latest adventures.
-   Browse trips by year, month, or destination.
-   Links to the photo gallery and travel stories.

### Trips listing

-   Display trips as photo cards.
-   Show each trip's cover image, destination, month, and year.
-   Filter or search trips by month and place.
-   Sort trips from newest to oldest.

### Trip details

Each trip can include: - Trip title and destination. - Month and year. -
Cover photo. - Photo gallery with click-to-zoom. - Embedded videos. -
Travel diary and memorable moments. - Places visited and optional
itinerary. - Previous/next trip navigation.

### Gallery

-   Responsive image grid.
-   Lightbox for larger photos.
-   Captions and optional photo dates.
-   Optimized thumbnails for faster page loading.

### Optional enhancements

-   Map of visited places.
-   Categories such as road trips, beaches, mountains, heritage, or
    family trips.
-   A dedicated About page.

## 4. Suggested Repository Structure

``` text
travel-blog/
├── index.html
├── trips.html
├── about.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── gallery.js
├── data/
│   └── trips.json
└── assets/
    ├── images/
    │   ├── 2026/
    │   │   └── 07-july-pune-road-trip/
    │   │       ├── cover.jpg
    │   │       ├── pune-01.jpg
    │   │       └── pune-02.jpg
    │   └── 2025/
    │       └── 12-december-goa/
    │           ├── cover.jpg
    │           └── beach-sunset.jpg
    └── icons/
```

The folder names above are examples. Replace them with your actual
trips.

## 5. Example Trip Data

Store trip metadata in `data/trips.json`. The website can read this file
to build trip cards and galleries.

``` json
[
  {
    "id": "pune-road-trip-2026-07",
    "title": "Pune Road Trip",
    "destination": "Pune, Maharashtra, India",
    "month": "July",
    "monthNumber": 7,
    "year": 2026,
    "coverImage": "assets/images/2026/07-july-pune-road-trip/cover.jpg",
    "description": "A road trip filled with scenic routes and memorable stops.",
    "photos": [
      {
        "src": "assets/images/2026/07-july-pune-road-trip/pune-01.jpg",
        "caption": "Scenic view along the route"
      },
      {
        "src": "assets/images/2026/07-july-pune-road-trip/pune-02.jpg",
        "caption": "A moment from the trip"
      }
    ],
    "videos": [
      {
        "title": "Trip highlights",
        "url": "https://www.youtube.com/embed/VIDEO_ID"
      }
    ],
    "placesVisited": ["Example stop 1", "Example stop 2"],
    "story": "Write your travel notes and memorable moments here."
  }
]
```

Use real photo paths and video embed URLs when adding your own trips.
The sample details are placeholders.

## 6. Adding a New Trip

1.  Create a folder under `assets/images/<year>/<month-destination>/`.
2.  Add a cover photo and optimized gallery photos.
3.  Add a new trip object to `data/trips.json`.
4.  Set the destination, month, year, description, photo paths, and
    story.
5.  Add a video embed URL if needed.
6.  Preview the website locally.
7.  Commit and push the changes to GitHub.

## 7. GitHub Pages Deployment

1.  Create a GitHub repository named `travel-blog` (or another name you
    prefer).

2.  Add the website source files and assets.

3.  Push the code to the repository's default branch.

4.  Open the repository's **Settings → Pages**.

5.  Configure GitHub Pages to deploy from the selected branch and root
    folder, or use a GitHub Actions workflow.

6.  Wait for deployment to complete and open the published URL,
    typically:

    `https://YOUR-USERNAME.github.io/travel-blog/`

7.  Test navigation, images, videos, and mobile layout on the published
    site.

For a project site, use relative asset paths such as `assets/images/...`
and test them under the repository URL path.

## 8. Media Storage Considerations

-   GitHub can store photographs, but compress and resize images before
    committing them.
-   Generate small thumbnails for gallery previews and use larger
    versions only in the lightbox.
-   Avoid committing large videos directly to Git; embed them from
    YouTube or another video-hosting service.
-   GitHub imposes repository, file-size, and GitHub Pages bandwidth
    limits. Check the current GitHub documentation before uploading
    large media collections.
-   Git tracks file history, so repeatedly replacing large media files
    can make the repository grow.

## 9. Design Direction

Recommended visual direction: - Colorful, vibrant travel photography. -
Large destination cover images. - Clean typography and generous
spacing. - Responsive photo cards and gallery layouts. - Simple
navigation: **Home · Trips · Gallery · About**. - Consistent month/year
labels and destination names.

## 10. Initial Scope

The first version should include: - Home page. - Trips listing with
month/place filters. - Trip detail and photo gallery. - Video embeds. -
JSON-based trip metadata. - Responsive layout. - GitHub Pages deployment
instructions.

An admin form, database, or backend can be considered later if adding
trips directly through the website becomes necessary.
