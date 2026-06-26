import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminAuthResult, AdminLoginInput, AdminMe, ContactInput, DeleteResponse, ErrorResponse, HealthStatus, ListRegistrationsParams, Registration, RegistrationInput, RegistrationStats } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubmitRegistrationUrl: () => string;
/**
 * @summary Submit player registration
 */
export declare const submitRegistration: (registrationInput: RegistrationInput, options?: RequestInit) => Promise<Registration>;
export declare const getSubmitRegistrationMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitRegistration>>, TError, {
        data: BodyType<RegistrationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitRegistration>>, TError, {
    data: BodyType<RegistrationInput>;
}, TContext>;
export type SubmitRegistrationMutationResult = NonNullable<Awaited<ReturnType<typeof submitRegistration>>>;
export type SubmitRegistrationMutationBody = BodyType<RegistrationInput>;
export type SubmitRegistrationMutationError = ErrorType<ErrorResponse>;
/**
* @summary Submit player registration
*/
export declare const useSubmitRegistration: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitRegistration>>, TError, {
        data: BodyType<RegistrationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitRegistration>>, TError, {
    data: BodyType<RegistrationInput>;
}, TContext>;
export declare const getListRegistrationsUrl: (params?: ListRegistrationsParams) => string;
/**
 * @summary List all registrations (admin only)
 */
export declare const listRegistrations: (params?: ListRegistrationsParams, options?: RequestInit) => Promise<Registration[]>;
export declare const getListRegistrationsQueryKey: (params?: ListRegistrationsParams) => readonly ["/api/registrations", ...ListRegistrationsParams[]];
export declare const getListRegistrationsQueryOptions: <TData = Awaited<ReturnType<typeof listRegistrations>>, TError = ErrorType<void>>(params?: ListRegistrationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRegistrations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listRegistrations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListRegistrationsQueryResult = NonNullable<Awaited<ReturnType<typeof listRegistrations>>>;
export type ListRegistrationsQueryError = ErrorType<void>;
/**
 * @summary List all registrations (admin only)
 */
export declare function useListRegistrations<TData = Awaited<ReturnType<typeof listRegistrations>>, TError = ErrorType<void>>(params?: ListRegistrationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRegistrations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRegistrationUrl: (id: number) => string;
/**
 * @summary Get a single registration (admin only)
 */
export declare const getRegistration: (id: number, options?: RequestInit) => Promise<Registration>;
export declare const getGetRegistrationQueryKey: (id: number) => readonly [`/api/registrations/${number}`];
export declare const getGetRegistrationQueryOptions: <TData = Awaited<ReturnType<typeof getRegistration>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRegistration>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRegistration>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRegistrationQueryResult = NonNullable<Awaited<ReturnType<typeof getRegistration>>>;
export type GetRegistrationQueryError = ErrorType<void>;
/**
 * @summary Get a single registration (admin only)
 */
export declare function useGetRegistration<TData = Awaited<ReturnType<typeof getRegistration>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRegistration>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDeleteRegistrationUrl: (id: number) => string;
/**
 * @summary Delete a registration (admin only)
 */
export declare const deleteRegistration: (id: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getDeleteRegistrationMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRegistration>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRegistration>>, TError, {
    id: number;
}, TContext>;
export type DeleteRegistrationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRegistration>>>;
export type DeleteRegistrationMutationError = ErrorType<void>;
/**
* @summary Delete a registration (admin only)
*/
export declare const useDeleteRegistration: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRegistration>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteRegistration>>, TError, {
    id: number;
}, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: RequestInit) => Promise<AdminAuthResult>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<void>;
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export declare const getGetAdminMeUrl: () => string;
/**
 * @summary Check admin session
 */
export declare const getAdminMe: (options?: RequestInit) => Promise<AdminMe>;
export declare const getGetAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getGetAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminMe>>>;
export type GetAdminMeQueryError = ErrorType<void>;
/**
 * @summary Check admin session
 */
export declare function useGetAdminMe<TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Admin logout
 */
export declare const adminLogout: (options?: RequestInit) => Promise<DeleteResponse>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
* @summary Admin logout
*/
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export declare const getGetStatsUrl: () => string;
/**
 * @summary Get registration statistics
 */
export declare const getStats: (options?: RequestInit) => Promise<RegistrationStats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get registration statistics
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubmitContactUrl: () => string;
/**
 * @summary Submit contact message
 */
export declare const submitContact: (contactInput: ContactInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getSubmitContactMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export type SubmitContactMutationResult = NonNullable<Awaited<ReturnType<typeof submitContact>>>;
export type SubmitContactMutationBody = BodyType<ContactInput>;
export type SubmitContactMutationError = ErrorType<void>;
/**
* @summary Submit contact message
*/
export declare const useSubmitContact: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map