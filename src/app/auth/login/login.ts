import { Component, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '../auth.store';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login implements OnInit {
    private authStore = inject(AuthStore);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    isLoading = this.authStore.isLoading;

    loginForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
    });

    constructor() {
        effect(() => {
            const authMessage = this.authStore.authMessage();
            if (authMessage.message) {
                const panelClass = authMessage.statusCode === 200 ? 'snack-success' : 'snack-error';
                this.snackBar.open(authMessage.message, 'Close', { duration: 3000, panelClass });
                this.authStore.clearMessages();
            }
        });
    }

    ngOnInit() { }

    onSubmit() {
        if (this.loginForm.invalid) return;
        const { username, email } = this.loginForm.value;
        this.authStore.login({ username: username ?? '', email: email ?? '' });
    }
}