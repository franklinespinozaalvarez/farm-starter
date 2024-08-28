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
                children: [
                    {
                        id: 'modulos.adminmolino.prima',
                        title: 'Materia Prima',
                        type: 'basic',
                        link: '/modulos/admin-molino/materia-prima',
                        icon: 'heroicons_outline:cube',
                    },
                    {
                        id: 'modulos.adminmolino.insumos',
                        title: 'Insumos',
                        type: 'basic',
                        link: '/modulos/admin-molino/insumos',
                        icon: 'mat_outline:science'
                    },
                ],
            },
        ]
    },



];

/*{
    id   : 'prima',
        title: 'Materia Prima',
    type : 'basic',
    icon : 'heroicons_outline:cube',
    link : '/avicola'
}*/

export const defaultNavigation: UrpiNavigationItem[] = navigationItem;
export const compactNavigation: UrpiNavigationItem[] = navigationItem;
export const futuristicNavigation: UrpiNavigationItem[] = navigationItem;
export const horizontalNavigation: UrpiNavigationItem[] = navigationItem;
