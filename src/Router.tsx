import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/app-layout'
import HomePage from './pages/Homepage'
import GisMap from './pages/GisMap'
import Visualization from './pages/Visualization'

export default function Router() {
    return (
        <Routes>
            <Route path='/gis-map' element={<GisMap />} />
            <Route path='/visualization' element={<Visualization />} />
            <Route element={<AppLayout />}>
                <Route path="" element={<HomePage />} />
            </Route>
        </Routes>
    )
}
