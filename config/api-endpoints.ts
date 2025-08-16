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

  GET_CONTRACTS: "/Contract",
  GET_CONTRACT: (id: string) => `/Contract/${id}`,
  CREATE_CONTRACT: "/Contract",
  UPDATE_CONTRACT: (id: string) => `/Contract/${id}`,
  DELETE_CONTRACT: (id: string) => `/Contract/${id}`,

  GET_CATEGORYS: "/Category",
  GET_CATEGORY: (id: string) => `/Category/${id}`,
  CREATE_CATEGORY: "/Category",
  UPDATE_CATEGORY: (id: string) => `/Category/${id}`,
  DELETE_CATEGORY: (id: string) => `/Category/${id}`,

  GET_WAREHOUSELOCATIONS: "/WarehouseLocations",
  GET_WAREHOUSELOCATION: (id: string) => `/WarehouseLocations/${id}`,
  CREATE_WAREHOUSELOCATION: "/WarehouseLocations",
  UPDATE_WAREHOUSELOCATION: (id: string) => `/WarehouseLocations/${id}`,
  DELETE_WAREHOUSELOCATION: (id: string) => `/WarehouseLocations/${id}`,
  GET_WAREHOUSELOCATIONS_WITH_CHILDREN: "/WarehouseLocations/With-Children",

  GET_CIVILIANS: "/Civilians",
  GET_CIVILIAN: (id: string) => `/Civilians/${id}`,
  CREATE_CIVILIAN: "/Civilians",
  UPDATE_CIVILIAN: (id: string) => `/Civilians/${id}`,
  DELETE_CIVILIAN: (id: string) => `/Civilians/${id}`,

  GET_MILITARY_PERSONS: "/MilitaryPersons",
  GET_MILITARY_PERSON: (id: string) => `/MilitaryPersons/${id}`,
  CREATE_MILITARY_PERSON: "/MilitaryPersons",
  UPDATE_MILITARY_PERSON: (id: string) => `/MilitaryPersons/${id}`,
  DELETE_MILITARY_PERSON: (id: string) => `/MilitaryPersons/${id}`,

  GET_SUBCATEGORIES: `/SubCategory`,
  GET_SUBCATEGORY: (id: string) => `/SubCategory/${id}`,
  GET_SUBCATEGORY_BY_CATEGORY_ID: (categoryId: string) => `/SubCategory/category/${categoryId}`,
  CREATE_SUBCATEGORY: `/SubCategory`,
  UPDATE_SUBCATEGORY: (id: string) => `/SubCategory/${id}`,
  DELETE_SUBCATEGORY: (id: string) => `/SubCategory/${id}`,

  GET_PRODUCTS: "/Products",
  GET_PRODUCT: (id: string) => `/Products/${id}`,
  GET_PRODUCT_BY_TEMP_NIIN: (tempNiin: string) => `/Products/temp-niin/${tempNiin}`,
  CREATE_PRODUCT: "/Products",
  UPDATE_PRODUCT: (id: string) => `/Products/${id}`,
  DELETE_PRODUCT: (id: string) => `/Products/${id}`,


  GET_ROLES: "/Roles",
  GET_ROLE: (id: string) => `/Roles/${id}`,
  CREATE_ROLE: "/Roles",
  UPDATE_ROLE: (id: string) => `/Roles/${id}`,
  DELETE_ROLE: (id: string) => `/Roles/${id}`,

};
