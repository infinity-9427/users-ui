import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { TransactionsComponent } from './pages/transactions/transactions.component'; // Ensure this is imported

const routes: Routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' }, // Set UsersComponent as the default route
  { path: 'users', component: UsersComponent }, // You can keep this if you want /users to also work
  { path: 'transactions/:userId', component: TransactionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}