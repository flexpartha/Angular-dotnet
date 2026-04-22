import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../auth/auth.store';
import { UserStore } from '../user-detail/user.store';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header {
    protected authStore = inject(AuthStore);
    protected userStore = inject(UserStore);

    logout() {
        this.authStore.logout();
    }
}