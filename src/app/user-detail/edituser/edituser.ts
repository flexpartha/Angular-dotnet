import {
    Component,
    inject,
    OnInit,
    ChangeDetectionStrategy,
    signal,
    effect,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { User } from '../models/user-list.interface';

@Component({
    selector: 'app-edituser',
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
    templateUrl: './edituser.html',
    styleUrl: './edituser.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edituser implements OnInit {
    private fb = inject(FormBuilder);
    private userStore = inject(UserStore);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);

    loading = this.userStore.loading;
    selectedUser = this.userStore.selectedUser;

    userForm: FormGroup;
    userId = signal<number | null>(null);

    constructor() {
        this.userForm = this.fb.group({
            id: [{ value: '', disabled: true }],
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

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            const id = +params['id'];
            this.userId.set(id);

            const user = this.selectedUser();
            if (user) {
                this.userForm.patchValue(user);
            }
        });
    }

    onSubmit() {
        if (this.userForm.valid) {
            const userData: User = {
                ...this.userForm.getRawValue(),
                id: this.userId()!,
            };
            this.userStore.updateUser({ user: userData });
        }
    }

    onCancel() {
        this.router.navigate(['/userlist']);
    }
}