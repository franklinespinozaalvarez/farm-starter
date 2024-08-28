import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup, Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { TablePagination, User } from '../security.types';
import { UsersService } from './users.service';
import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { urpiAnimations } from '@urpi/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';
import { UrpiConfirmationService } from '@urpi/services/confirmation/confirmation.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
      AsyncPipe,NgClass,NgIf,NgFor,NgTemplateOutlet,
      MatTableModule,MatPaginatorModule,MatSortModule,
      FormsModule,MatFormFieldModule,MatIconModule,MatButtonModule,ReactiveFormsModule,MatInputModule,
      MatSlideToggleModule,MatRippleModule,MatSelectModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: urpiAnimations,
})
export class UsersComponent implements OnInit{

    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    pagination: TablePagination;
    selectedUser: any = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    cols = [
        { field: 'avatar', header: 'Avatar', width: 'min-w-32'},
        { field: 'name', header: 'Nombre', width: 'min-w-20'},
        { field: 'username', header: 'Usuario', width: 'min-w-96'},

        { field: 'email', header: 'Correo', width: 'min-w-32'},
        { field: 'country', header: 'Pais', width: 'min-w-32'},
        { field: 'city', header: 'Ciudad', width: 'min-w-44',},

    ];

    displayedColumns = [ 'avatar', 'name','username','email','country','city'];

    users$: Observable<User[]>;
    selectedUserForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;

    roles = ['Administrador Molino','Molinero','Cocinero','Administrador'];

    cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];

    moment: string = 'new';
    constructor(
        private _users: UsersService,
        private _change: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _confirmation: UrpiConfirmationService,
    ) {}

    ngOnInit(): void {

        // Create the selected user form
        this.selectedUserForm = this._formBuilder.group({
            id: [''],
            avatar: [''],
            name: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            email: [''],
            city: ['', [Validators.required]],
            status: [''],
            role: ['']
        });

        this.users$ = this._users.users$;

        // Get the pagination
        this._users.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TablePagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._change.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._users.getUsers(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._change.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get users if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._users.getUsers(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedUser = null;
    }

    /**
     * Create user
     */
    createUser(): void {
        this.moment = 'new';
        // Create the user
        this._users.createUser().subscribe((newProduct) => {
            // Go to new user
            this.selectedUser = newProduct;

            // Fill the form
            this.selectedUserForm.patchValue(newProduct);

            // Mark for check
            this._change.markForCheck();
        });
    }

    /**
     * Delete the selected user using the form data
     */
    deleteSelectedUser(): void {
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Baja usuario',
            message: 'Estás seguro de que deseas dar de baja a este usuario?',
            actions: {
                confirm: {
                    label: 'Borrar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the user object
                const user = this.selectedUserForm.getRawValue();

                // Delete the user on the server
                this._users
                    .deleteProduct(user.id)
                    .subscribe(() => {
                        // Close the details
                        this.closeDetails();
                        this.isLoading = true;
                        this._users.getUsers(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    });
            }
        });
    }

    /**
     * Delete the row user
     */
    deleteRowUser(id: any): void {
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Baja usuario',
            message: 'Estás seguro de que deseas dar de baja a este usuario?',
            actions: {
                confirm: {
                    label: 'Borrar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Delete the user on the server
                this._users
                    .deleteProduct(id)
                    .subscribe(() => {

                    });
            }
        });
    }

    /**
     * Update the selected user using the form data
     */
    updateSelectedUser(): void {
        // Get the user object
        const user = this.selectedUserForm.getRawValue();
        console.warn('updateSelectedUser',user);

        // Update the user on the server
        this._users
            .updateUser(user.id, user)
            .subscribe(() => { console.warn('EXITO');
                this.closeDetails();
                // Show a success message
                this.showFlashMessage('success');
            });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._change.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._change.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Toggle user details
     *
     * @param userId
     */
    toggleDetails(userId: string): void {
        this.moment = 'edit';
        // If the user is already selected...
        if (this.selectedUser && this.selectedUser.id === userId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the user by id
        this._users
            .getProductById(userId)
            .subscribe((user) => {
                // Set the selected user
                this.selectedUser = user;

                // Fill the form
                this.selectedUserForm.patchValue(user);

                // Mark for check
                this._change.markForCheck();
            });
    }
}
