import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { LoadingState } from "../components/common/PageState";
import MainLayout from "../layouts/MainLayout";

/* oxlint-disable react/only-export-components */

const HomePage = lazy(() => import("../pages/HomePage"));
const SurahsPage = lazy(() => import("../pages/SurahsPage"));
const ReaderPage = lazy(() => import("../pages/ReaderPage"));
const BookmarksPage = lazy(() => import("../pages/BookmarksPage"));
const OfflinePage = lazy(() => import("../pages/OfflinePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const load = (Page) => <Suspense fallback={<LoadingState/>}><Page/></Suspense>;

export const router = createBrowserRouter([{ element: <MainLayout/>, children: [
  { path: "/", element: load(HomePage) },
  { path: "/surahs", element: load(SurahsPage) },
  { path: "/surah/:chapterId", element: load(ReaderPage) },
  { path: "/bookmarks", element: load(BookmarksPage) },
  { path: "/offline", element: load(OfflinePage) },
  { path: "/settings", element: load(SettingsPage) },
  { path: "*", element: load(NotFoundPage) },
]}]);
