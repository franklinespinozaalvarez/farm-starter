import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { UserMockApi } from 'app/mock-api/common/user/api';



import { SecurityMockApi } from 'app/mock-api/security/api';

export const mockApiServices = [
    AuthMockApi,
    MessagesMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    UserMockApi,
    SecurityMockApi
];
