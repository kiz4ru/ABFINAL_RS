import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./components/history/history.component')
      .then(c => c.HistoryComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component')
      .then(c => c.SettingsComponent)
  },
  {
    path: 'todo', // Nueva ruta para la lista de tareas
    loadComponent: () => import('./components/todo-list/todo-list.component')
      .then(c => c.TodoListComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];