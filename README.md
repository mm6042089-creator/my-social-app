# Maiven — Connect. Share. Be Yourself.

A production-quality social media web app built with React, Vite, and React
Router, connected to the real **Route Posts API** (Route Academy).

## Brand

**Maiven** — a name built from "Mai" + "haven," for a space that feels like
a home base for the people you actually want to hear from. The monogram is
a stylized "M" made of two connected peaks with an orbiting node, meant to
read as *people, linked together* (see `src/components/Logo.jsx`).

## Stack

- **React 18** + **Vite**
- **react-router-dom** — routing
- **framer-motion** — page transitions and micro-interactions
- **react-hot-toast** — toast notifications
- **react-hook-form** + **zod** + **@hookform/resolvers** — forms and validation
- **axios** — centralized API client
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

By default the app talks to `https://route-posts.routemisr.com`. To point
at a different environment, set `VITE_API_URL` before running the dev
server or build.

## Project structure

```
src/
  main.jsx, App.jsx        entry point + provider shell
  index.css                 design system (tokens, layout, components)
  config/
    api.js                  centralized axios instance (base URL, auth
                             header injection, 401/403 handling, envelope
                             unwrapping helpers)
  api/
    auth/auth.api.js         register(), login(), changePassword(), logout()
    posts/posts.api.js       getPosts, getFeed, getPostById, createPost,
                              updatePost, deletePost, toggleLike,
                              toggleBookmark, sharePost
    comments/comments.api.js getComments, createComment, updateComment,
                              deleteComment, toggleCommentLike
    users/users.api.js       getMyProfile, uploadProfilePhoto, getSuggestedUsers
  validations/                zod schemas (auth, post, comment, password)
  types/                      JSDoc typedefs (User, Post, Comment, requests)
  context/
    ThemeContext.jsx          light/dark mode (persisted)
    AuthContext.jsx           auth state, session restoration, token handling
  hooks/
    useAuth.js                re-exports the AuthContext hook
    usePosts.js                feed loading/pagination + post mutations
    useComments.js             comment loading + mutations
  routes/
    AppRoutes.jsx              central route table
    ProtectedRoute.jsx         redirects unauthenticated users to /login
  layouts/
    AppLayout.jsx               sidebar + topbar + shared delete-confirm modal
  components/                  Sidebar, TopBar, RightSidebar, PostCard,
                                PostForm, CommentCard/Form/List, Avatar,
                                Modal, Feedback (skeletons/empty/error states)
  pages/
    HomePage, PostDetailsPage, ProfilePage, CreatePostPage, EditPostPage,
    ChangePasswordPage, PlaceholderPage
    auth/ LoginPage, RegisterPage, AuthShell
  utils/
    token.js                   localStorage token get/set/clear
    helpers.js                  cx(), initialsOf(), timeAgo()
```

Data flow follows: **UI (pages/components) -> hooks -> api modules ->
central axios client -> Route Posts API.** No component calls axios
directly.

## Routes

| Path | Access |
|---|---|
| `/login`, `/register` | public only (redirects to `/home` if already signed in) |
| `/home` | protected — main feed |
| `/posts/:id` | protected — post detail + comments |
| `/profile` | protected |
| `/create-post` | protected |
| `/edit-post/:id` | protected — owner only |
| `/change-password` | protected |

Any protected route redirects to `/login` if there's no valid session.
`/explore`, `/notifications`, `/messages` are kept as honest "coming soon"
states in the sidebar/nav — the API has no backing endpoints for a real
explore feed or DM inbox, so these deliberately show no fake data.

## API integration notes — please read before your presentation

The exact endpoints, methods, and the response envelope below were pulled
directly from Route Academy's published documentation for Route Posts
(`https://route-posts.routemisr.com/`, Postman collection linked from that
page). Every request in this app goes through `src/config/api.js`, which
attaches `Authorization: Bearer <token>` automatically and unwraps the
`{ success, message, data, meta }` envelope.

```
POST   /users/signup
POST   /users/signin
PATCH  /users/change-password
PUT    /users/upload-photo
GET    /users/profile-data
GET    /users/suggestions?page=&limit=

GET    /posts
GET    /posts/feed?only=&page=&limit=
POST   /posts
PUT    /posts/:postId
PUT    /posts/:postId/like
GET    /posts/:postId/likes?page=&limit=
PUT    /posts/:postId/bookmark
POST   /posts/:postId/share

GET    /posts/:postId/comments?page=&limit=
POST   /posts/:postId/comments
PUT    /posts/:postId/comments/:commentId
DELETE /posts/:postId/comments/:commentId
PUT    /posts/:postId/comments/:commentId/like
```

**Two assumptions to verify before final submission**, called out in code
comments where they're used (`src/api/posts/posts.api.js`):

1. `GET /posts/:postId` (single post detail) and `DELETE /posts/:postId`
   (delete a post) were **not** in the published endpoint summary table,
   but every other post-scoped action (like, bookmark, comments) follows
   the `/posts/:postId` pattern, so the app assumes these exist too. If
   the live API differs, `posts.api.js` is the only file to change.
2. Exact request-body field names for `signup`/`signin`/`change-password`
   (`name/email/password/rePassword`, `login` accepting email-or-username)
   follow Route Academy's documented convention but weren't spelled out
   field-by-field on the docs page. Adjust in `src/api/auth/auth.api.js`
   if the API rejects a field name — the validation schemas and forms
   don't need to change, just the payload shape sent to `http.post`.

Both `Post` and `Comment` objects are passed through a `normalize*()`
function (in the matching `*.api.js` file) that defensively reads a few
possible field-name variants (e.g. `likesCount ?? likes?.length ?? likes`).
If the live API's field names differ from the assumption, that one
function is the single place to fix — nothing downstream changes.

## Authentication flow

Register -> account created -> redirected to Login -> sign in -> token
stored (`localStorage`, key `maiven_token`) -> `AuthContext` verifies the
token against `GET /users/profile-data` on every app load (session
restoration) -> Home. A 401/403 from any request anywhere in the app
clears the token and drops the person back to `/login` automatically.
