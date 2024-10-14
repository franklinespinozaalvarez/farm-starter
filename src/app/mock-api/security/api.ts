import { Injectable } from '@angular/core';
import { UrpiMockApiService,UrpiMockApiUtils } from '@urpi/lib/mock-api';
import { users,roles} from 'app/mock-api/security/data';
import { assign, cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class SecurityMockApi {
    private _users: any = users;
    private _roles: any = roles;

    /**
     * Constructor
     */
    constructor(private _mockApi: UrpiMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onGet('api/admin/users')
            .reply(({request}) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the users
                let users: any[] | null = cloneDeep(this._users);

                // Sort the users
                if (sort === 'username' || sort === 'name' || sort === 'city' || sort === 'email' /*|| sort === 'role'*/) {
                    users.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    users.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    users = users.filter(
                        (user) =>
                            user.name &&
                            user.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            user.username &&
                            user.username
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            user.city &&
                            user.city
                                .toLowerCase()
                                .includes(search.toLowerCase()) /*||
                            user.role &&
                            user.role
                                .toLowerCase()
                                .includes(search.toLowerCase())*/
                    );
                }

                // Paginate - Start
                const usersLength = users.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), usersLength);
                const lastPage = Math.max(Math.ceil(usersLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    users = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    users = users.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: usersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        users,
                        pagination,
                    },
                ];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ User - POST
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onPost('api/admin/user')
            .reply(() => {
                // Generate a new user
                const newUser = {
                    id: UrpiMockApiUtils.guid(),
                    avatar: '',
                    name: '',
                    username: '',
                    password: '',
                    email: '',
                    city: '',
                    status: true,
                    role: '',
                };

                // Unshift the new user
                this._users.unshift(newUser);

                // Return the response
                return [200, newUser];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onPatch('api/admin/user')
            .reply(({ request }) => {
                // Get the id and user
                const id = request.body.id;
                const user = cloneDeep(request.body.user);

                // Prepare the updated user
                let updatedUser = null;

                // Find the user and update it
                this._users.forEach((item, index, users) => {
                    if (item.id === id) {
                        // Update the user
                        users[index] = assign({}, users[index], user);

                        // Store the updated user
                        updatedUser = users[index];
                    }
                });

                // Return the response
                return [200, updatedUser];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ User - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onDelete('api/admin/user')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the user and delete it
                this._users.forEach((item, index) => {
                    if (item.id === id) {
                        this._users.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });



        // -----------------------------------------------------------------------------------------------------
        // @ Role - GET
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onGet('api/admin/roles')
            .reply(({request}) => {
                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);
                console.warn('this._roles',this._roles);
                // Clone the roles
                let roles: any[] | null = cloneDeep(this._roles);

                // Sort the roles
                if (sort === 'description' || sort === 'name' || sort === 'module') {
                    roles.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    roles.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    roles = roles.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            role.description &&
                            role.description
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            role.module &&
                            role.module
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const rolesLength = roles.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), rolesLength);
                const lastPage = Math.max(Math.ceil(rolesLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    roles = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    roles = roles.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: rolesLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        roles,
                        pagination,
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ User - POST
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onPost('api/admin/role')
            .reply(() => {
                // Generate a new role
                const newRol = {
                    id: UrpiMockApiUtils.guid(),
                    name: '',
                    description: '',
                    status: true
                };

                // Unshift the new module
                this._roles.unshift(newRol);

                // Return the response
                return [200, newRol];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Rol - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onPatch('api/admin/role')
            .reply(({ request }) => {
                // Get the id and user
                const id = request.body.id;
                const role = cloneDeep(request.body.role);
                console.warn('updateRole', request.body.id,request.body.role);
                // Prepare the updated user
                let updatedRol = null;

                // Find the user and update it
                this._roles.forEach((item, index, roles) => {
                    if (item.id === id) {
                        // Update the user
                        roles[index] = assign({}, roles[index], role);

                        // Store the updated role
                        updatedRol = roles[index];
                    }
                });

                // Return the response
                return [200, updatedRol];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Role - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._mockApi
            .onDelete('api/admin/role')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the role and delete it
                this._roles.forEach((item, index) => {
                    if (item.id === id) {
                        this._roles.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
