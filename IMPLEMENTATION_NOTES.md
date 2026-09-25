# Implementation notes

## Search vs category
DummyJSON has no combined search+category endpoint. We clear the other when one is set so the URL and API call stay consistent. Search priority is shown via a small UI note when search is active.

## Race-safe fetching
`app/dashboard/page.tsx` aborts the previous request and ignores responses whose request id is stale. Debounce (500ms) lives in `components/Search.tsx`.

## Local CRUD overlay
`lib/localStore.ts` keeps added products, field updates, and deleted ids in `localStorage`. List/detail/edit read through this overlay so the UI stays correct even though DummyJSON does not persist writes.

## Auth
Login stores `accessToken` as `token` for the Axios Authorization header. Dashboard layout redirects unauthenticated users to `/login`.

## Invalid query params
`parsePositiveInt` / `parsePageSize` in `lib/utils.ts` sanitize `page` and `pageSize`. Oversized pages clamp after `total` is known.
