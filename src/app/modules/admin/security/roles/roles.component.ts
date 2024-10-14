import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { TablePagination, Role } from '../security.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UrpiConfirmationService } from '@urpi/services/confirmation/confirmation.service';
import { Subject,Observable,merge,switchMap,takeUntil,debounceTime } from 'rxjs';
import { AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';
import { RolesService } from './roles.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MenusService } from '../menus/menus.service';
import { map } from 'lodash-es';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
      AsyncPipe,NgClass,NgIf,NgFor,NgTemplateOutlet,
      MatTableModule,MatPaginatorModule,MatSortModule,
      FormsModule,MatFormFieldModule,MatIconModule,MatButtonModule,ReactiveFormsModule,MatInputModule,
      MatSlideToggleModule,MatRippleModule,MatTooltipModule,MatSelectModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    pagination: TablePagination;
    selectedRole: any = {};
    selected: any = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    //roles$: Observable<Role[]>;
    roles: any = [];
    selectedRoleForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;

    moment: string = 'new';
    public menus: any = [];
    constructor(
        private _roles: RolesService,
        private _change: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _confirmation: UrpiConfirmationService,
        private _menus: MenusService
    ) {}

    ngOnInit(): void {

        // Create the selected role form
        this.selectedRoleForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            /*code: ['', [Validators.required]],*/
            menu: ['']
        });

        //this.roles$ = this._roles.roles$;

        this._roles.getRoles().subscribe((data)=>{
            //console.warn('data.roles',data.roles);
            this.roles = data.roles;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });

        this._menus.get().subscribe((response)=>{
            this.menus =response.data;
            //console.warn('this.menus',this.menus)
            //this.roles = data.roles;
            // Update the pagination
            /*this.pagination = data.pagination;*/
            // Mark for check
            this._change.markForCheck();
        });

        // Get the pagination
        /*this._roles.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TablePagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._change.markForCheck();
            });*/

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._roles.getRoles(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
                }),
                /*map(() => {
                    this.isLoading = false;
                })*/
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

            // If the role changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get roles if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._roles.getRoles(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    /*map(() => {
                        this.isLoading = false;
                    })*/
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
        this.selectedRole = null;
    }

    /**
     * Create role
     */
    createRole(): void {
        this.moment = 'new';
        // Create the role
        let newRole = {code: '',name: '',description: ''};
        // Go to new role
        this.selectedRole = newRole;
        this.selectedRoleForm.reset();
        // Fill the form
        this.selectedRoleForm.patchValue(newRole);
        this.roles =[newRole, ...this.roles];

        // Mark for check
        this._change.markForCheck();
    }

    /**
     * Delete the selected role using the form data
     */
    deleteSelectedRole(): void {
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro de eliminar el rol?',
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
                // Get the role object
                const role = this.selectedRoleForm.getRawValue();

                // Delete the role on the server
                this._roles.deleteRole(role.id).subscribe(() => {
                    Swal.fire({
                        title: "Rol eliminado exitosamente !!!",
                        icon: "success"
                    });

                    // Close the details
                    this.closeDetails();
                    this.isLoading = true;
                    this.reload();
                });
            }
        });
    }

    /**
     * Delete the row role
     */
    deleteRowRole(id: any): void {
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que quieres eliminar el rol seleccionado?',
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

                // Delete the role on the server
                this._roles.deleteRole(id).subscribe((data:any) => {
                    if (data instanceof HttpErrorResponse ){
                        Swal.fire({
                            title: "No se pudo eliminar el rol seleccionado !!!",
                            icon: "error"
                        });
                    }else{
                        Swal.fire({
                            title: "Rol eliminado exitosamente !!!",
                            icon: "success"
                        });
                        this.reload();
                    }
                });
            }
        });
    }

    /**
     * Update the selected role using the form data
     */
    updateSelectedRole(): void {
        // Get the role object
        const role = this.selectedRoleForm.getRawValue();
        Object.keys(this.selectedRoleForm.getRawValue()).forEach(key => {

            if( key == 'id' && this.moment === 'new' )
                delete role[key];

        });

        // Save or Update the role on the server
        if (this.moment === 'new') {
            this._roles.postRole(role).subscribe(() => {
                this.closeDetails();
                this.selectedRoleForm.reset();
                // Show a success message
                this.showFlashMessage('success');
                this.roles = this.roles.filter((item)=>item.id !== '0');

                Swal.fire({
                    title: "Rol creado exitosamente !!!",
                    icon: "success"
                });
                this.reload();
            });
        } else {
            this._roles.updateRole(role.id, role).subscribe(() => {
                this.closeDetails();
                this.selectedRoleForm.reset();
                // Show a success message
                this.showFlashMessage('success');

                Swal.fire({
                    title: "Rol actualizado exitosamente!",
                    icon: "success"
                });
                this.reload();
            });
        }
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
     * Toggle role details
     *
     * @param roleId
     */
    toggleDetails(roleId: string): void { console.warn('this.selectedRole',this.selectedRole);
        this.moment = 'edit';
        // If the role is already selected...
        if (this.selectedRole && this.selectedRole.id === roleId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the role by id
        this._roles
            .getRoleById(roleId)
            .subscribe((role) => {
                // Set the selected role
                this.selectedRole = role;

                this.selectedRole.menu = map(this.selectedRole.menuResponseList,'id');
                // Fill the form
                this.selectedRoleForm.patchValue(this.selectedRole);

                // Mark for check
                this._change.markForCheck();
            });
    }

    /**
     * reload role details
     */
    reload(){
        this._roles.getRoles().subscribe((data)=>{
            this.roles = data.roles;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }

    displayMenus(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }
}
