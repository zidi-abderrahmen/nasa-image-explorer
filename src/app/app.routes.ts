import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ImageGallery } from './components/image-gallery/image-gallery';
import { ImageDetail } from './components/image-detail/image-detail';
import { Search } from './components/search/search';
import { Favorites } from './components/favorites/favorites';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'gallery', component: ImageGallery },
    { path: 'detail/:date', component: ImageDetail },
    { path: 'search', component: Search },
    { path: 'favorites', component: Favorites },
    { path: '**', redirectTo: '' }
];
