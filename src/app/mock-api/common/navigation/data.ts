/* eslint-disable */
import { UrpiNavigationItem } from '@urpi/components/navigation';

const navigationItem: UrpiNavigationItem[] = [

    /*{
        id: 'dashboards',
        title: 'Dashboards',
        subtitle: 'Tablero de Analiticas',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.analytics',
                title: 'Analytics',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            }
        ],
    },*/

    {
        id: 'modulos',
        title: 'MODULOS',
        subtitle: 'Modulos Granja Avicola',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'modulos.admin',
                title: 'Administrador',
                type: 'collapsable',
                icon: 'heroicons_outline:cog-8-tooth',
                role: 'ADMIN',
                children: [
                    {
                        id: 'modulos.admin.usuarios',
                        title: 'Usuarios',
                        type: 'basic',
                        link: '/modulos/admin/usuarios',
                        icon: 'heroicons_outline:users',
                    },
                    {
                        id: 'modulos.admin.roles',
                        title: 'Roles',
                        type: 'basic',
                        link: '/modulos/admin/roles',
                        icon: 'mat_outline:manage_accounts'
                    },
                ],
            },

            {
                id: 'modulos.adminmolino',
                title: 'Administrador Molino',
                type: 'collapsable',
                icon: 'heroicons_outline:cog-8-tooth',
                role: 'ADMIN_MOL',
                children: [

                    {
                        id: 'modulos.adminmolino.producto',
                        title: 'Producto',
                        type: 'basic',
                        link: '/modulos/admin-molino/producto',
                        icon: 'mat_outline:shopping_cart'
                    },
                    {
                        id: 'modulos.adminmolino.proveedor',
                        title: 'Proveedor',
                        type: 'basic',
                        link: '/modulos/admin-molino/proveedor',
                        icon: 'mat_outline:add_business'
                    },

                    {
                        id: 'modulos.adminmolino.prima',
                        title: 'Materia Prima e Isumos',
                        type: 'basic',
                        link: '/modulos/admin-molino/materia-prima',
                        icon: 'heroicons_outline:cube',
                    },

                    {
                        id: 'modulos.adminmolino.granja',
                        title: 'Granjas',
                        type: 'basic',
                        link: '/modulos/admin-molino/granja',
                        icon: 'mat_outline:house'
                    },

                    {
                        id: 'modulos.adminmolino.etapa',
                        title: 'Etapa',
                        type: 'basic',
                        link: '/modulos/admin-molino/etapa',
                        icon: 'mat_outline:inventory'
                    },

                    {
                        id: 'modulos.adminmolino.inventario',
                        title: 'Inventario',
                        type: 'basic',
                        link: '/modulos/admin-molino/inventario',
                        icon: 'heroicons_outline:cube',
                    },

                    {
                        id: 'modulos.adminmolino.tipoproducto',
                        title: 'Tipo Producto',
                        type: 'basic',
                        link: '/modulos/admin-molino/tipo-producto',
                        icon: 'mat_outline:compost'
                    },



                    {
                        id: 'modulos.adminmolino.formulas',
                        title: 'Formulas',
                        type: 'basic',
                        link: '/modulos/admin-molino/formulas',
                        icon: 'mat_outline:edit_note'
                    },

                    {
                        id: 'modulos.adminmolino.ordenes',
                        title: 'Pedidos',
                        type: 'basic',
                        link: '/modulos/admin-molino/ordenes',
                        icon: 'mat_outline:edit_note'
                    },
                    {
                        id: 'modulos.adminmolino.despachos',
                        title: 'Despachos',
                        type: 'basic',
                        link: '/modulos/admin-molino/despachos',
                        icon: 'heroicons_outline:cube',
                    },
                    {
                        id: 'modulos.adminmolino.molienda',
                        title: 'Molienda',
                        type: 'basic',
                        link: '/modulos/admin-molino/molienda',
                        icon: 'heroicons_outline:cube',
                    },
                    {
                        id: 'modulos.adminmolino.reportes',
                        title: 'Reportes',
                        type: 'basic',
                        link: '/modulos/admin-molino/reportes',
                        icon: 'mat_outline:print',
                    }
                ],
            },
        ]
    },
];

export const defaultNavigation: UrpiNavigationItem[] = navigationItem;
export const compactNavigation: UrpiNavigationItem[] = navigationItem;
export const futuristicNavigation: UrpiNavigationItem[] = navigationItem;
export const horizontalNavigation: UrpiNavigationItem[] = navigationItem;
