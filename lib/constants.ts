export const API_ENDPOINTS = {
  LOGIN: "/Authentication/login",
  LOGOUT: "/Authentication/logout",
  REFRESH: "/Authentication/refresh",

  GET_USERS: "/admins",
  GET_USER: (id: string) => `/admins/${id}`,
  CREATE_USER: "/admins",
  UPDATE_USER: (id: string) => `/admins/${id}`,
  DELETE_USER: (id: string) => `/admins/${id}`,
  DELETE_SELECTED_USERS: "/admins/selected",

  GET_USER_TYPES: "/admin-types",
  GET_USER_TYPE: (id: string) => `/admin-types/${id}`,
  CREATE_USER_TYPE: "/admin-types",
  UPDATE_USER_TYPE: (id: string) => `/admin-types/${id}`,
  DELETE_USER_TYPE: (id: string) => `/admin-types/${id}`,

  GET_SITES: "/Sites",
  GET_SITE: (id: string) => `/Sites/${id}`,
  CREATE_SITE: "/Sites",
  UPDATE_SITE: (id: string) => `/Sites/${id}`,
  DELETE_SITE: (id: string) => `/Sites/${id}`,
  GET_SITES_WITH_CHILDREN: "/Sites/With-Children",

  GET_VENDORS: "/Vendors",
  GET_VENDOR: (id: string) => `/Vendors/${id}`,
  CREATE_VENDOR: "/Vendors",
  UPDATE_VENDOR: (id: string) => `/Vendors/${id}`,
  DELETE_VENDOR: (id: string) => `/Vendors/${id}`,
};
