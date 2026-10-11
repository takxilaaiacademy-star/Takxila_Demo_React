import type { ComponentType } from 'react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout, { PageLoader } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import routes from './data/routes.json';


const modules = import.meta.glob<Record<string, ComponentType<any>>>('./pages/**/*.tsx');

const lazyCache = new Map<string, React.LazyExoticComponent<ComponentType<any>>>();

function getComponent(file: string, exportName?: string) {
  const key = `${file}:${exportName || 'default'}`;
  let Component = lazyCache.get(key);
  if (!Component) {
    const loader = modules[file];
    if (!loader) throw new Error(`Page module not found: ${file}`);
    Component = lazy(() =>
      loader().then((mod) => ({
        default: exportName ? mod[exportName] : (mod.default ?? mod),
      }))
    );
    lazyCache.set(key, Component);
  }
  return Component;
}

export const preloadPages = () => {
  Object.values(modules).forEach((load) => void load());
};

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routes.public.map(({ path, file }) => {
          const Page = getComponent(file);
          return <Route key={path} path={path} element={<Page />} />;
        })}

        {routes.redirects.map(({ path, to }) => (
          <Route key={path} path={path} element={<Navigate to={to} replace />} />
        ))}

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {routes.protected.map((r) => {
              const Page = getComponent(r.file, 'export' in r ? r.export : undefined);
              const props = 'props' in r ? r.props : undefined;
              return <Route key={r.path} path={r.path} element={<Page {...props} />} />;
            })}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
