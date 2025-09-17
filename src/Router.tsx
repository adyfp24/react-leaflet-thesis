import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/app-layout'
import HomePage from './pages/Homepage'
import GisMap from './pages/GisMap'

export default function Router() {
    return (
        <Routes>
            <Route path='/gis-map' element={<GisMap />} />
            <Route element={<AppLayout />}>
                <Route path="" element={<HomePage />} />
            </Route>
        </Routes>
    )
}
