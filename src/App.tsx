import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout, { PageLoader } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Landing from './pages/Landing';

// Every other page is its own chunk, loaded the first time it is opened.
const Home = lazy(() => import('./pages/Home'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Refer = lazy(() => import('./pages/Refer'));
const Resume = lazy(() => import('./pages/Resume'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Mentorship = lazy(() => import('./pages/Mentorship'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Purchases = lazy(() => import('./pages/account/Purchases'));
const Profile = lazy(() => import('./pages/account/Profile'));
const Grades = lazy(() => import('./pages/account/Grades'));
const Calendar = lazy(() => import('./pages/account/Calendar'));
const Files = lazy(() => import('./pages/account/Files'));
const Reports = lazy(() => import('./pages/account/Reports'));
const Preferences = lazy(() => import('./pages/account/Preferences'));
const About = lazy(() => import('./pages/Info').then((m) => ({ default: m.About })));
const Helpdesk = lazy(() => import('./pages/Info').then((m) => ({ default: m.Helpdesk })));
const Contact = lazy(() => import('./pages/Info').then((m) => ({ default: m.Contact })));
const Policies = lazy(() => import('./pages/Info').then((m) => ({ default: m.Policies })));
const NotFound = lazy(() => import('./pages/Info').then((m) => ({ default: m.NotFound })));

// Download every page in the background after the first paint, so later page changes are instant.
export const preloadPages = () => {
  void import('./pages/Announcements');
  void import('./pages/Calculator');
  void import('./pages/Cart');
  void import('./pages/Certificates');
  void import('./pages/CourseDetail');
  void import('./pages/Courses');
  void import('./pages/Dashboard');
  void import('./pages/Home');
  void import('./pages/Info');
  void import('./pages/Leaderboard');
  void import('./pages/Mentorship');
  void import('./pages/MyCourses');
  void import('./pages/Refer');
  void import('./pages/Resume');
  void import('./pages/account/Calendar');
  void import('./pages/account/Files');
  void import('./pages/account/Grades');
  void import('./pages/account/Preferences');
  void import('./pages/account/Profile');
  void import('./pages/account/Purchases');
  void import('./pages/account/Reports');
};

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth#register" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="courses/:id/grades" element={<CourseDetail tab="grades" />} />
            <Route path="cart" element={<Cart />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="refer" element={<Refer />} />
            <Route path="resume" element={<Resume />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="profile" element={<Profile />} />
            <Route path="grades" element={<Grades />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="files" element={<Files />} />
            <Route path="reports" element={<Reports />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="about" element={<About />} />
            <Route path="helpdesk" element={<Helpdesk />} />
            <Route path="contact" element={<Contact />} />
            <Route path="policies" element={<Policies />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
