import {
    Component,
    inject,
    ChangeDetectionStrategy,
    effect,
} from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStore } from '../user.store';

@Component({
    selector: 'app-adduser',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './adduser.html',
    styleUrl: './adduser.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Adduser {
    private fb = inject(FormBuilder);
    private userStore = inject(UserStore);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    loading = this.userStore.loading;

    userForm: FormGroup;

    constructor() {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            website: ['', Validators.required],
            address: this.fb.group({
                street: ['', Validators.required],
                suite: [''],
                city: ['', Validators.required],
                zipcode: ['', Validators.required],
                geo: this.fb.group({
                    lat: ['0'],
                    lng: ['0'],
                }),
            }),
            company: this.fb.group({
                name: [''],
                catchPhrase: [''],
                bs: [''],
            }),
        });

        effect(() => {
            const errorMsg = this.userStore.error();
            if (errorMsg) {
                this.snackBar.open(errorMsg, 'Close', { duration: 3000, panelClass: 'snack-error' });
                this.userStore.clearMessages();
            }
        });
    }

    onSubmit() {
        if (this.userForm.valid) {
            const userData = this.userForm.value;
            this.userStore.addUser({ user: userData });
        }
    }

    onCancel() {
        this.router.navigate(['/userlist']);
    }
}