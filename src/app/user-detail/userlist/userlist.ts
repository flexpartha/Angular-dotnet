import {
    Component,
    inject,
    OnInit,
    ChangeDetectionStrategy,
    signal,
    computed,
    effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../user.store';
import { User } from '../models/user-list.interface';

@Component({
    selector: 'app-userlist',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        FormsModule,
    ],
    templateUrl: './userlist.html',
    styleUrl: './userlist.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Userlist implements OnInit {
    private userStore = inject(UserStore);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    users = this.userStore.users;
    loading = this.userStore.loading;
    error = this.userStore.error;
    successMessage = this.userStore.successMessage;

    displayedColumns = [
        'id',
        'name',
        'username',
        'email',
        'phone',
        'website',
        'actions',
    ];

    pageIndex = signal(0);
    pageSize = signal(5);
    sortBy = signal<'asc' | 'desc'>('asc');
    sortColumn = signal<keyof User>('id');
    searchTerm = signal('');

    filteredUsers = computed(() => {
        let users = this.users();
        const search = this.searchTerm().toLowerCase();

        if (search) {
            users = users.filter(
                (user: User) =>
                    user.name.toLowerCase().includes(search) ||
                    user.username.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search) ||
                    user.phone.includes(search)
            );
        }

        // Sort
        const sortCol = this.sortColumn();
        const sortDir = this.sortBy();
        users = [...users].sort((a, b) => {
            const aVal = a[sortCol];
            const bVal = b[sortCol];
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return users;
    });

    paginatedUsers = computed(() => {
        const start = this.pageIndex() * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredUsers().slice(start, end);
    });

    totalUsers = computed(() => this.filteredUsers().length);

    constructor() {
        effect(() => {
            const errorMsg = this.error();
            if (errorMsg) {
                this.snackBar.open(errorMsg, 'Close', { duration: 3000, panelClass: 'snack-error' });
                this.userStore.clearMessages();
            }
        });

        effect(() => {
            const successMsg = this.successMessage();
            if (successMsg) {
                this.snackBar.open(successMsg, 'Close', { duration: 3000, panelClass: 'snack-success' });
                this.userStore.clearMessages();
            }
        });
    }

    ngOnInit() {
        this.userStore.loadUsers();
    }

    onSearch(value: string) {
        this.searchTerm.set(value);
        this.pageIndex.set(0);
    }

    onPage(event: PageEvent) {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
    }

    onSort(sort: Sort) {
        if (sort.direction) {
            this.sortColumn.set(sort.active as keyof User);
            this.sortBy.set(sort.direction as 'asc' | 'desc');
        } else {
            this.sortBy.set('asc');
            this.sortColumn.set('id');
        }
    }

    addNewUser() {
        this.router.navigate(['/userlist/adduser']);
    }

    editUser(user: User) {
        console.log('Editing user:', user);
        this.userStore.setSelectedUser(user);
        this.router.navigate(['/userlist/edituser', user.id]);
    }

    deleteUser(user: User) {
        if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
            this.userStore.deleteUser({ id: user.id });
        }
    }
}