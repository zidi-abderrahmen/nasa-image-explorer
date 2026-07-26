import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    title: 'NASA Image Explorer — Picture of the Day',
    data: { breadcrumb: 'Home', description: 'Discover NASA\'s Astronomy Picture of the Day' }
  },
  {
    path: 'gallery',
    loadComponent: () => import('./components/image-gallery/image-gallery').then(m => m.ImageGallery),
    title: 'Gallery — NASA Image Explorer',
    data: { breadcrumb: 'Gallery' }
  },
  {
    path: 'detail/:date',
    loadComponent: () => import('./components/image-detail/image-detail').then(m => m.ImageDetail),
    title: 'Image Details — NASA Image Explorer',
    data: { breadcrumb: 'Details' }
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search').then(m => m.Search),
    title: 'Search — NASA Image Explorer',
    data: { breadcrumb: 'Search' }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites').then(m => m.Favorites),
    title: 'My Favorites — NASA Image Explorer',
    data: { breadcrumb: 'Favorites' }
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound),
    title: 'Page Not Found — NASA Image Explorer'
  }
];